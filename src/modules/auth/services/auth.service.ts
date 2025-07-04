import {
  ForgotPasswordEmailDto,
  LoginDto,
} from 'src/common/dtos/auth';
import { AdminSeedDto, UpdateAdminPasswordDto, UpdateAdminProfileImageDto, UpdateAdminProfileDto } from 'src/common/dtos/adminSeed.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Messages } from 'src/common/constants/messages.constant';
import { Model, Types } from 'mongoose';
import { Admin } from 'src/common/schema/admin.schema';
import { Subscriber } from 'src/common/schema/subscriber.schema';
import { Condominium } from 'src/common/schema/condominium.schema';
import { SubscriptionPackage } from 'src/common/schema/subscriptionPackage.schema';
import { EmailVerification } from 'src/common/schema/emailVerification.schema';
import { SubscriptionRequestDocument, SubscriptionRequest } from 'src/common/schema/subscriptionRequest.schema';

import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from 'src/common/dtos/auth/jwt-payload.dto';
import { BadRequestException } from '@nestjs/common';
import * as EmailTemplate from 'src/utils/email-templates';
import { VerifyEmailDto } from 'src/common/dtos/auth/verify-email.dto';
import { CreateAccountDto } from '../../../common/dtos/auth/create-account.dto';
import { CheckEmailDto } from '../../../common/dtos/auth/check-email.dto';
import { PasswordSetUserCreateDto } from '../../../common/dtos/auth/set-pasword-and-create-user.dto';
import { USER_ROLES, PLAN_STATUS } from 'src/common/constants/ENUM';
import { SUBSCRIPTION_REQUEST_STATUS, SUBSCRIPTION_REQUEST_TYPES } from 'src/common/dtos/ENUM';
import axios from 'axios';
import { MailService } from 'src/services/mailtrap.service';
import { S3Service } from 'src/services/s3.service';
import { randomUUID } from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Subscriber.name) private subscriberModel: Model<Subscriber>,
    @InjectModel(Condominium.name) private condominiumModel: Model<Condominium>,
    @InjectModel(SubscriptionPackage.name) private subscriptionPackageModel: Model<SubscriptionPackage>,
    @InjectModel(EmailVerification.name) private emailVerificationModel: Model<EmailVerification>,
    @InjectModel(SubscriptionRequest.name)
    private readonly subscriptionRequestModel: Model<SubscriptionRequestDocument>,
    private jwtService: JwtService,
    private s3Service: S3Service,
    private readonly mailService: MailService,
  ) { }

  private createToken(user: any): string {
    const payload: JwtPayloadDto = {
      id: user._id,
      email: user.email
    };

    return this.jwtService.sign(payload);
  }
  private async fetchAddressDetailsFromZipcode(zipcode: string) {
    const formattedZipcode = zipcode.replace('-', '').replace('.', '');
    const url = `https://viacep.com.br/ws/${formattedZipcode}/json/`

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      throw new BadRequestException('Invalid Zipcode');
    }
  }
  private async fetchAddressDetailsFromZipcode2(zipcode: string) {
    const formattedZipcode = zipcode.replace('-', '').replace('.', '');
    const url = `https://brasilapi.com.br/api/cep/v1/${formattedZipcode}`

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      throw new BadRequestException('Invalid Zipcode');
    }
  }
  private async checkAndCreateCondominium(body: CreateAccountDto) {
    const { condominiumName, cep, estado, cidade, numero, logradouro, bairro, complemento, numberOfUnitsInCondominium } = body;
    const addressData = await this.fetchAddressDetailsFromZipcode2(cep);

    let condominium = await this.condominiumModel.create({
      condominiumName: condominiumName,
      condominiumZipCode: cep,
      condominiumAddressLine2: complemento,
      condominiumAddressLine1_1of3: logradouro ?? addressData?.street,
      condominiumAddressLine1_2of3: numero,
      condominiumAddressLine1_3of3: bairro ?? addressData?.neighborhood,
      state: estado ?? addressData?.state,
      city: cidade ?? addressData?.city,
      numberOfUnitsInCondominium: numberOfUnitsInCondominium,
    });

    return condominium;
  }

  async seedAdmin(adminSeedDto: AdminSeedDto) {
    const { fullName, email, phoneNumber, password } = adminSeedDto;
    const checkEmail = await this.adminModel.findOne({ email });
    if (checkEmail) {
      throw new BadRequestException('User already exist');
    }

    return await this.adminModel.create({
      email: email.toLowerCase(),
      password,
      fullName,
      phoneNumber,
    });
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Check for the admin login first
    const adminCheck: any = await this.adminModel
      .findOne({
        isDeleted: { $ne: true },
        email: email.toLowerCase(),
      });
    if (adminCheck) {
      const isValidPassword = await adminCheck.validatePassword(password.trim());
      if (!isValidPassword) {
        throw new BadRequestException(Messages.BAD_LOGIN_REQUEST);
      }
      if (adminCheck.profilePicture?.uuid) {
        const link = await this.s3Service.getPreSignedUrl(
          adminCheck.profilePicture.uuid,
          'admin'
        );
        adminCheck.profilePicture = link;
      }
      await adminCheck.save();
      const token = this.createToken({ ...adminCheck.toObject() });
      return {
        token,
        role: 'admin',
        user: adminCheck,
      };
    }

    // Check for the subscriber login
    const subscriberCheck: any = await this.subscriberModel
      .findOne({
        isDeleted: { $ne: true },
        email: email.toLowerCase(),
      });
    if (subscriberCheck) {
      const isValidPassword = await subscriberCheck.validatePassword(password.trim());
      if (!isValidPassword) {
        throw new BadRequestException(Messages.BAD_LOGIN_REQUEST);
      }
      if (subscriberCheck.status === false) {
        // throw new BadRequestException('Your account is disabled. Please contact the admin');
        throw new BadRequestException('Pagamento em análise. Por favor, aguarde até que sua conta seja aprovada.');
      }
      const token = this.createToken({ ...subscriberCheck.toObject() });
      const manager = await this.subscriberModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(subscriberCheck._id) }
        },
        {
          $lookup: {
            from: "condominia",
            localField: "condominium",
            foreignField: "_id",
            as: "condominium"
          }
        },
        {
          $lookup: {
            from: "subscriptionpackages",
            localField: "currentSubscriptionPlan",
            foreignField: "_id",
            as: "subscriptionPlan"
          }
        },
        {
          $lookup: {
            from: "subscriptionrequests",
            let: { subscriberId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$subscriberId", "$$subscriberId"]
                  }
                }
              },
              {
                $lookup: {
                  from: "subscriptionpackages",
                  let: { subscriptionId: { $toObjectId: "$subscriptionId" } },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$subscriptionId"]
                        }
                      }
                    }
                  ],
                  as: "subscriptionPackage"
                }
              },
              {
                $addFields: {
                  subscriptionPackage: { $arrayElemAt: ["$subscriptionPackage", 0] }
                }
              }
            ],
            as: "subscriptionrequest"
          }
        },
        {
          $addFields: {
            condominium: { $arrayElemAt: ["$condominium", 0] },
            subscriptionPlan: "$currentSubscriptionPlanObject",
            subscriptionrequest: { $arrayElemAt: ["$subscriptionrequest", 0] }
          }
        }
      ]);
      return {
        token,
        role: 'subscriber',
        user: manager[0],
      };
    }

    // Check for the condominium for the gatehouse login
    const condominiumCheck: any = await this.condominiumModel.findOne({ condominiumID: email });
    if (condominiumCheck) {
      const subscriberCheck: any = await this.subscriberModel.findOne({ condominium: condominiumCheck._id });
      if (subscriberCheck) {
        const isValidPassword = await subscriberCheck.validateGatehousePassword(password.trim());
        if (!isValidPassword) {
          throw new BadRequestException(Messages.BAD_LOGIN_REQUEST);
        }
        const subscriber = await this.subscriberModel.aggregate([
          {
            $match: { _id: new Types.ObjectId(subscriberCheck._id) }
          },
          {
            $lookup: {
              from: "condominia",
              localField: "condominium",
              foreignField: "_id",
              as: "condominium"
            }
          },
          {
            $lookup: {
              from: "subscriptionpackages",
              localField: "currentSubscriptionPlan",
              foreignField: "_id",
              as: "subscriptionPlan"
            }
          },
          {
            $lookup: {
              from: "subscriptionrequests",
              let: { subscriberId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$subscriberId", "$$subscriberId"]
                    }
                  }
                },
                {
                  $lookup: {
                    from: "subscriptionpackages",
                    let: { subscriptionId: { $toObjectId: "$subscriptionId" } },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$_id", "$$subscriptionId"]
                          }
                        }
                      }
                    ],
                    as: "subscriptionPackage"
                  }
                },
                {
                  $addFields: {
                    subscriptionPackage: { $arrayElemAt: ["$subscriptionPackage", 0] }
                  }
                }
              ],
              as: "subscriptionrequest"
            }
          },
          {
            $addFields: {
              condominium: { $arrayElemAt: ["$condominium", 0] },
              subscriptionPlan: "$currentSubscriptionPlanObject",
              subscriptionrequest: { $arrayElemAt: ["$subscriptionrequest", 0] }
            }
          }
        ]);
        const token = this.createToken({ ...subscriberCheck.toObject() });
        return {
          token,
          role: 'gatehouse',
          user: subscriber[0],
        };
      }
      throw new BadRequestException(Messages.BAD_LOGIN_REQUEST);
    }
    throw new BadRequestException(Messages.BAD_LOGIN_REQUEST);
  }

  async signUp(createAccountDto: CreateAccountDto) {
    const {
      email,
      telefone,
      celular,
      gatehousePassword,
      password,
      cnjp,
      subscriptionID,
      proofOfPayment } = createAccountDto

    const existingUser = await this.subscriberModel.findOne({
      isDeleted: { $ne: true },
      email: email.toLowerCase(),
    });
    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new BadRequestException('A subscriber with same email already exists');
      }
    }

    const checkSubscrition = await this.subscriptionPackageModel.findOne({
      _id: subscriptionID,
      isDeleted: { $ne: true },
    });

    if (!checkSubscrition) {
      throw new BadRequestException('Invalid subscription');
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const condominium = await this.checkAndCreateCondominium(createAccountDto);

    let proofOfPaymentFile = null
    if(proofOfPayment){
      proofOfPaymentFile = await this.s3Service.uploadFile(
        proofOfPayment,
        randomUUID(),
        'paymentProofs',
      );
    }
    const checkEmailVerification = await this.emailVerificationModel.findOne({ email: email.toLocaleLowerCase(), emailVerified: true });

    let user = new this.subscriberModel({
      email: email.toLowerCase(),
      phoneNumber: telefone,
      cellPhoneNumber: celular,
      role: USER_ROLES.MANAGER,
      otp: otp,
      status: false,
      planStatus: PLAN_STATUS.PENDING,
      cnjp: cnjp,
      emailVerified: checkEmailVerification ? true : false,
      condominium: condominium._id,
      gateHousePassword: gatehousePassword,
      password: password,
    });
    if (proofOfPayment) {
      user.currentSubscriptionPlan = subscriptionID
      user.currentSubscriptionPlanObject = checkSubscrition
      user.proofOfPayment = proofOfPaymentFile
    }
    await user.save();

    const data = EmailTemplate.welcomeEmail(condominium.condominiumName, condominium.condominiumID);
    await this.mailService.sendMail(email, data.SUBJECT, data.HTML);

    if (!proofOfPayment) {
      await this.subscriptionRequestModel.create({
        subscriberId: user._id,
        subscriptionId: subscriptionID,
        type: SUBSCRIPTION_REQUEST_TYPES.UPGRADE,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: SUBSCRIPTION_REQUEST_STATUS.PENDING
      })
    }
    return {
      msg: 'Usuário registrado com sucesso. O administrador aprovará a conta e então você poderá fazer login.',
      user,
    };
  }

  async verifyAccount(body: VerifyEmailDto) {
    const { email, otp, isForgotPassword } = body;

    const emailVerificationCheck = await this.emailVerificationModel.findOne({
      email: email.toLowerCase(), emailVerified: false
    });
    if (!emailVerificationCheck) {
      return { success: false, message: "Verificação de e-mail não iniciada" };
    }
    if (isForgotPassword) {

      if (emailVerificationCheck?.forgetPasswordOTP && emailVerificationCheck?.forgetPasswordOTP.toString() != otp.toString()) {
        return { success: false, message: "E-mail de verificação não iniciado" };
      }

      emailVerificationCheck.forgetPasswordOTP = null;
      await emailVerificationCheck.save();
      return { user: emailVerificationCheck };
    }
    if (!emailVerificationCheck?.otp || emailVerificationCheck?.otp == null) {
      return { success: false, message: "Nenhum OTP encontrado" };
    }
    if (emailVerificationCheck?.otp && emailVerificationCheck?.otp.toString() != otp.toString()) {
      return { success: false, message: "OTP é inválido" };
    }
    emailVerificationCheck.otp = null;
    emailVerificationCheck.emailVerified = true;
    await emailVerificationCheck.save();
    return { success: true, message: "OTP Verificado" };
  }

  async forgotPasswordEmail(body: ForgotPasswordEmailDto) {
    const { email } = body;
    const userCheck = await this.subscriberModel.findOne({
      email: email.toLowerCase(),
    });
    if (!userCheck) {
      throw new BadRequestException('User does not exist');
    }

    let emailVerification = await this.emailVerificationModel.findOne({ email: email.toLowerCase(), emailVerified: false });
    if (!emailVerification) {
      emailVerification = await this.emailVerificationModel.create({ email: email.toLowerCase(), emailVerified: false });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    emailVerification.forgetPasswordOTP = otp;
    await emailVerification.save();
    const data = EmailTemplate.verifyEmail('user', otp);
    await this.mailService.sendMail(email, data.SUBJECT, data.HTML);

    return {
      msg: 'An OTP Code has been sent to your E-Mail.',
    };
  }

  async setPassword(passwordSetDto: PasswordSetUserCreateDto) {
    const { email, password } = passwordSetDto;

    const user = await this.subscriberModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new BadRequestException(Messages.USER.DOES_NOT_EXIST);
    }
    const updatedUser = await this.subscriberModel.findById(user._id)
    updatedUser.password = password
    updatedUser.save()



    return { id: updatedUser._id, fullName: updatedUser.fullName };
  }

  async checkEmail(checkEmailDto: CheckEmailDto) {
    const { email } = checkEmailDto;
    const user = await this.subscriberModel.findOne({ email: email.toLowerCase() });
    if (user && user.emailVerified) {
      return { success: true, message: 'E-mail já existe' };
    }
    return { success: false, message: 'E-mail não existe' };
  }

  async resendOtp(checkEmailDto: CheckEmailDto) {
    const { email } = checkEmailDto;
    let emailVerification = await this.emailVerificationModel.findOne({ email: email.toLowerCase(), emailVerified: false });
    if (!emailVerification) {
      emailVerification = await this.emailVerificationModel.create({ email: email.toLowerCase(), emailVerified: false });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    emailVerification.otp = otp;
    await emailVerification.save();
    const data = EmailTemplate.verifyEmail('user', otp);
    await this.mailService.sendMail(email, data.SUBJECT, data.HTML);

    return {
      msg: 'An OTP Code has been sent to your E-Mail'
    }
  }

  async updateAdminProfile(updateAdminProfileDto: UpdateAdminProfileDto, id) {
    const adminProfile = await this.adminModel.findById(id);
    adminProfile.fullName = updateAdminProfileDto.fullName
    adminProfile.email = updateAdminProfileDto.email
    adminProfile.phoneNumber = updateAdminProfileDto.phoneNumber
    adminProfile.save();

    return adminProfile
  }
  async updateAdminProfilePassword(updateAdminPasswordDto: UpdateAdminPasswordDto, id) {
    const adminProfile: any = await this.adminModel.findById(id);
    const isValidPassword = await adminProfile.validatePassword(updateAdminPasswordDto.currentPassword.trim());
    if (!isValidPassword) {
      throw new BadRequestException(Messages.INVALID_PASSWORD);
    }
    adminProfile.password = updateAdminPasswordDto.newPassword;

    adminProfile.save();

    return adminProfile
  }

  async updateAdminProfileImage(body: UpdateAdminProfileImageDto, id) {
    const { file } = body;
    const adminImage = await this.s3Service.uploadFile(
      file,
      randomUUID(),
      'admin',
    );
    const adminProfile = await this.adminModel.findById(id);
    adminProfile.profilePicture = adminImage
    await adminProfile.save();
    adminProfile.profilePicture = await this.s3Service.getPreSignedUrl(
      adminProfile.profilePicture.uuid,
      'admin',
    );
    return adminProfile
  }

}
