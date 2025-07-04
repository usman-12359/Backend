import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubscriberDocument, Subscriber } from 'src/common/schema/subscriber.schema';
import { CondominiumDocument, Condominium } from 'src/common/schema/condominium.schema';
import { SubscriptionPackageDocument, SubscriptionPackage } from 'src/common/schema/subscriptionPackage.schema';
import { SubscriberSubscriptionCancellationDocument, SubscriberSubscriptionCancellation } from 'src/common/schema/subscriberSubscriptionCanellation.schema';
import { SubscriptionRequestDocument, SubscriptionRequest } from 'src/common/schema/subscriptionRequest.schema';
import { UnitDocument, Unit } from 'src/common/schema/unit.schema';
import { BaseService } from 'src/services/base.service';
import { ManagerCreateDto, ManagerUpdateDto, UploadProofOfPaymentDto } from 'src/common/dtos/manager.dto';
import { USER_ROLES, PLAN_STATUS, SUBSCRIPTION_PLAN_TYPES, PLAN_CANCELLATION_STATUS } from 'src/common/constants/ENUM'
import { SUBSCRIPTION_REQUEST_TYPES, SUBSCRIPTION_REQUEST_STATUS } from 'src/common/dtos/ENUM';
import axios from 'axios';
import { S3Service } from 'src/services/s3.service';
import { randomUUID } from 'crypto';
import { addMonths, addYears } from 'date-fns';
import * as EmailTemplate from 'src/utils/email-templates';
import { MailService } from 'src/services/mailtrap.service';

@Injectable()
export class ManagerService extends BaseService<
  Subscriber,
  SubscriberDocument
> {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly userModel: Model<SubscriberDocument>,
    @InjectModel(Condominium.name)
    private readonly condominiumModel: Model<CondominiumDocument>,
    @InjectModel(Unit.name)
    private readonly unitModel: Model<Unit>,
    @InjectModel(SubscriptionPackage.name)
    private readonly subscriptionPackageModel: Model<SubscriptionPackageDocument>,
    @InjectModel(SubscriberSubscriptionCancellation.name)
    private readonly subscriberSubscriptionCancellationModel: Model<SubscriberSubscriptionCancellationDocument>,
    @InjectModel(SubscriptionRequest.name)
    private readonly subscriptionRequestModel: Model<SubscriptionRequestDocument>,
    private s3Service: S3Service,
    private readonly mailService: MailService,
  ) {
    super(userModel);
  }

  private async fetchAddressDetailsFromZipcode2(zipcode: string) {
    const formattedZipcode = zipcode.replace('-', '').replace('.', '');
    const url = `https://brasilapi.com.br/api/cep/v1/${formattedZipcode}`

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      throw new BadRequestException('CEP inválido');
    }
  }

  private async checkAndCreateCondominium(body: ManagerCreateDto) {
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
  private async checkAndUpdateCondominium(id: string, body: ManagerUpdateDto) {
    const { condominiumName, cep, estado, cidade, numero, logradouro, bairro, complemento, numberOfUnitsInCondominium } = body;
    const addressData = await this.fetchAddressDetailsFromZipcode2(cep);

    let condominium = await this.condominiumModel.findById(id)
    condominium.condominiumName = condominiumName
    condominium.condominiumZipCode = cep
    condominium.condominiumAddressLine2 = complemento
    condominium.condominiumAddressLine1_1of3 = logradouro ?? addressData?.street
    condominium.condominiumAddressLine1_2of3 = numero
    condominium.condominiumAddressLine1_3of3 = bairro ?? addressData?.neighborhood
    condominium.state = estado ?? addressData?.state
    condominium.city = cidade ?? addressData?.city
    condominium.numberOfUnitsInCondominium = numberOfUnitsInCondominium
    condominium.save()

    return condominium;
  }
  private calculateExpirationDate(startDate: Date, type: string): Date {
    let expirationDate;
    if (type === SUBSCRIPTION_PLAN_TYPES.MONTHLY) {
      expirationDate = addMonths(startDate, 1);
    } else {
      expirationDate = addYears(startDate, 1);
    }
    // Subtract one day from the expiration date
    expirationDate.setDate(expirationDate.getDate() - 1);
    return expirationDate;
  }
  ////////////////////// Manager Routes //////////////////////
  // Create a New Manager
  async createManager(managerCreateDto: ManagerCreateDto) {
    const {
      email,
      telefone,
      celular,
      gatehousePassword,
      password,
      cnjp,
      subscriptionID,
      planExpirationDate } = managerCreateDto
    // Check for the existing user/subscriber
    const existingUser = await this.userModel.findOne({
      isDeleted: { $ne: true },
      email: email.toLowerCase(),
    });
    if (existingUser) {
      throw new BadRequestException('A subscriber with same email already exists');
    }
    const condominium = await this.checkAndCreateCondominium(managerCreateDto);
    const checkSubscrition = await this.subscriptionPackageModel.findOne({
      _id: subscriptionID,
      isDeleted: { $ne: true },
    });
    const manager = await this.userModel.create({
      email: email.toLowerCase(),
      phoneNumber: telefone,
      cellPhoneNumber: celular,
      role: USER_ROLES.MANAGER,
      emailVerified: true,
      status: true,
      cnjp: cnjp,
      currentSubscriptionPlan: subscriptionID,
      currentSubscriptionPlanObject: checkSubscrition,
      condominium: condominium._id,
      gateHousePassword: gatehousePassword,
      password: password,
      planStatus: PLAN_STATUS.ACTIVE,
      planStartingDate: new Date(),
      // planExpirationDate: planExpirationDate ? planExpirationDate : checkSubscrition.type === SUBSCRIPTION_PLAN_TYPES.MONTHLY ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      planExpirationDate: this.calculateExpirationDate(new Date(), checkSubscrition.type)
    });
    return manager;
  }
  //List all managers
  async listManagers() {
    const managers = await this.userModel.aggregate([
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
        $addFields: {
          condominium: { $arrayElemAt: ["$condominium", 0] },
          // subscriptionPlan: { $arrayElemAt: ["$subscriptionPlan", 0] }
          subscriptionPlan: "$currentSubscriptionPlanObject"
        }
      },
      {
        $project: {
          _id: "$_id",
          condominiumID: "$condominium.condominiumID",
          email: "$email",
          planName: "$subscriptionPlan.name",
          createdAt: "$createdAt",
          status: "$status",
          planStatus: "$planStatus"
        }
      }
    ]);
    for (let index in managers) {
      managers[index].status = (!managers[index].status || !managers[index].planStatus) ? "Necessita Aprovação" : "Aprovado"
    }
    return managers;
  }
  //Get an manager
  async getManager(id: string) {
    const manager = await this.userModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) }
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
          from: "subscribersubscriptioncancellations",
          let: { subscriberId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$subscriberId", "$$subscriberId"]
                },
                status: PLAN_CANCELLATION_STATUS.APPLIED
              }
            }
          ],
          as: "cancelledSubscription"
        }
      },
      {
        $addFields: {
          condominium: { $arrayElemAt: ["$condominium", 0] },
          subscriptionPlan: "$currentSubscriptionPlanObject",
          cancelledSubscription: { $arrayElemAt: ["$cancelledSubscription", 0] }
        }
      }
    ]);
    if (manager[0].proofOfPayment) {
      const link = await this.s3Service.getPreSignedUrl(
        manager[0].proofOfPayment.uuid,
        'paymentProofs'
      );
      manager[0].proofOfPayment = link
    }
    return manager[0] ?? null;
  }
  //Update an manager
  async updateManager(id: string, managerUpdateDto: ManagerUpdateDto) {
    const {
      email,
      telefone,
      celular,
      gatehousePassword,
      password,
      cnjp,
      userStatus,
      planStatus,
      subscriptionID,
      planExpirationDate } = managerUpdateDto
    const checkManager = await this.userModel.findOne({ _id: { $ne: id }, email: managerUpdateDto.email.toLowerCase() })
    if (checkManager) {
      throw new BadRequestException('Subscriber with same email id already exists')
    }
    const manager = await this.userModel.findById(id);
    if (manager) {
      manager.email = email.toLowerCase()
      manager.phoneNumber = telefone
      manager.cellPhoneNumber = celular
      manager.role = USER_ROLES.MANAGER
      manager.emailVerified = true
      if (userStatus)
        manager.status = userStatus
      if (planStatus)
        manager.planStatus = planStatus
      manager.cnjp = cnjp
      if (password)
        manager.password = password;
      if (gatehousePassword)
        manager.gateHousePassword = gatehousePassword;

      if ((manager?.currentSubscriptionPlanObject && manager?.currentSubscriptionPlanObject._id.toString() != subscriptionID) || (!manager?.currentSubscriptionPlanObject && subscriptionID) ) {
        const checkSubscrition = await this.subscriptionPackageModel.findOne({
          _id: subscriptionID,
          isDeleted: { $ne: true },
        });
        manager.currentSubscriptionPlan = subscriptionID
        manager.currentSubscriptionPlanObject = checkSubscrition
        manager.planStartingDate = new Date()
        manager.planStatus = PLAN_STATUS.ACTIVE
        // manager.planExpirationDate = planExpirationDate ? planExpirationDate : (checkSubscrition.type === SUBSCRIPTION_PLAN_TYPES.MONTHLY ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
        manager.planExpirationDate =  this.calculateExpirationDate(new Date(), checkSubscrition.type);

      } else {
        manager.planExpirationDate = planExpirationDate
      }
      await manager.save();
      await this.checkAndUpdateCondominium(manager.condominium, managerUpdateDto);
      const user = await this.userModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) }
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
          $addFields: {
            condominium: { $arrayElemAt: ["$condominium", 0] },
            // subscriptionPlan: { $arrayElemAt: ["$subscriptionPlan", 0] }
            subscriptionPlan: "$currentSubscriptionPlanObject"
          }
        }
      ]);
      if (user[0]?.proofOfPayment && user[0]?.proofOfPayment?.uuid) {
        const link = await this.s3Service.getPreSignedUrl(
          user[0].proofOfPayment.uuid,
          'paymentProofs'
        );
        user[0].proofOfPayment = link
      }
      return user[0];
    }
    return {}
  }
  // update manager status
  async updateManagerStatus(id: string, status: number) {
    // const manager = await this.userModel.findById(id);
    const manager = await this.userModel.findOne({ condominium: new Types.ObjectId(id) });
    if (manager) {
      if (status == 1) {
        manager.status = status == 1 ? true : false
        if (manager.currentSubscriptionPlanObject) {
          manager.planStatus = PLAN_STATUS.ACTIVE
          manager.planStartingDate = new Date()
          // manager.planExpirationDate = manager.currentSubscriptionPlanObject.type === SUBSCRIPTION_PLAN_TYPES.MONTHLY ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          manager.planExpirationDate = this.calculateExpirationDate(new Date(), manager.currentSubscriptionPlanObject.type)
        }
        await manager.save()
        const data = EmailTemplate.accountApprovalEmail(manager.fullName);
        await this.mailService.sendMail(manager.email, data.SUBJECT, data.HTML);
      }
      return { message: `Condomínio foi ${status == 1 ? 'aprovado' : 'rejeitado'}` }
    }
  }
  // Delete an Manager
  async deleteManager(id: string) {
    await this.userModel.findByIdAndDelete(id);
    return { message: 'Condomínio excluído com sucesso' };
  }
  // Cancel Subscription
  async cancelSubscription(id: string) {
    const manager = await this.userModel.findById(id);
    if (!manager) {
      throw new BadRequestException('Manager not found');
    }
    const checkCancelledSubscription = await this.subscriberSubscriptionCancellationModel.findOne({
      subscriberId: id,
      subscriptionId: manager?.currentSubscriptionPlan,
      status: PLAN_CANCELLATION_STATUS.APPLIED
    })
    if (checkCancelledSubscription) {
      return { message: 'Assinatura já foi cancelada' }
    }
    const cancellationApplied = new this.subscriberSubscriptionCancellationModel()
    cancellationApplied.subscriberId = id
    cancellationApplied.subscriptionId = manager?.currentSubscriptionPlan
    cancellationApplied.status = PLAN_CANCELLATION_STATUS.APPLIED
    cancellationApplied.save()

    return { message: 'Assinatura cancelada com sucesso' }
  }
  // Update Subscription
  async updateSubscription(body: UploadProofOfPaymentDto, id: string, subscriptionID: string, type: number) {
    const { file } = body;
    let proofImage = null
    if (file) {
      proofImage = await this.s3Service.uploadFile(
        file,
        randomUUID(),
        'paymentProofs',
      );
    }
    const manager = await this.userModel.findById(id);
    if (!manager) {
      throw new BadRequestException('Manager not found');
    }
    const checkSubscrition = await this.subscriptionPackageModel.findById(subscriptionID);
    if (!checkSubscrition) {
      throw new BadRequestException('Seu pacote atual foi descontinuado. Por favor, envie uma solicitação de atualização e escolha outro plano');
    }
    if (type == 0) {
      await this.subscriptionRequestModel.deleteMany({ subscriberId: manager._id })

      await this.subscriptionRequestModel.create({
        subscriberId: manager._id,
        subscriptionId: subscriptionID,
        type: (manager?.currentSubscriptionPlan && manager?.currentSubscriptionPlan?.toString() == subscriptionID) ? SUBSCRIPTION_REQUEST_TYPES.RENEWAL : SUBSCRIPTION_REQUEST_TYPES.UPGRADE,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        proofOfPayment: proofImage,
        status: SUBSCRIPTION_REQUEST_STATUS.PENDING
      })
    } else {
      const request = await this.subscriptionRequestModel.findOne({ subscriberId: manager._id, subscriptionId: subscriptionID })
      request.proofOfPayment = proofImage
      request.save()

    }

    return { message: 'Solicitação de assinatura enviada com sucesso' }
  }
  // Get subscription Requests
  async getSubscriptionRequests() {
    const subscriptionRequests = await this.subscriptionRequestModel.aggregate([
      {
        $match: {
          status: SUBSCRIPTION_REQUEST_STATUS.PENDING
        }
      },
      {
        $lookup: {
          from: "subscribers",
          let: { subscriberId: "$subscriberId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$subscriberId" }]
                }
              }
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
              $addFields: {
                condominium: { $arrayElemAt: ["$condominium", 0] },
              }
            }
          ],
          as: "manager"
        }
      },
      {
        $lookup: {
          from: "subscriptionpackages",
          let: { subscriptionId: "$subscriptionId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$subscriptionId" }]
                }
              }
            }
          ],
          as: "package"
        }
      },
      {
        $addFields: {
          subscriber: { $arrayElemAt: ["$manager", 0] },
          subscriptionPackage: { $arrayElemAt: ["$package", 0] },
        }
      },
      {
        $project: {
          _id: "$_id",
          planName: "$subscriptionPackage.name",
          condominiumID: "$subscriber.condominium.condominiumID",
          email: "$subscriber.email",
          proofOfPayment: "$proofOfPayment",
          type: "$type"
        }
      }

    ])
    for (let index in subscriptionRequests) {
      if (subscriptionRequests[index].proofOfPayment?.uuid) {
        const link = await this.s3Service.getPreSignedUrl(
          subscriptionRequests[index].proofOfPayment?.uuid,
          'paymentProofs'
        );
        subscriptionRequests[index].proofOfPayment = link
      }
    }
    return { subscriptionRequests }
  }
  //Update manager status
  async updateManagerSubscriptionStatus(id: string, status: number) {
    const subscriptionRequest = await this.subscriptionRequestModel.findById(id)
    if (subscriptionRequest) {
      if (status == 0) {     // Reject the request
        await this.subscriptionRequestModel.deleteOne({ _id: new Types.ObjectId(id) })
      } else if (status == 1) {
        subscriptionRequest.status = SUBSCRIPTION_REQUEST_STATUS.ACTIVE
        await subscriptionRequest.save();
        await this.renewUpgradeSubscriptions()
      }
      return { message: `A solicitação foi ${status == 1 ? "aceita" : "rejeitada"}` }
    } else {
      throw new BadRequestException('Invalid Subscription');
    }

  }
  // Get expired subscriptions
  async getExpiredSubscriptions() {
    const expiredSubscriptions = await this.userModel.find({
      planExpirationDate: { $lt: new Date() },
      planStatus: PLAN_STATUS.ACTIVE
    });

    return expiredSubscriptions;
  }
  //Cron function for cancellation of the manager
  async checkManagerSubscriptionCancellation() {
    const checkAppliedCancellations = await this.subscriberSubscriptionCancellationModel.find({ status: PLAN_CANCELLATION_STATUS.APPLIED })

    for (let i = 0; i < checkAppliedCancellations.length; i++) {
      const subscriber = await this.userModel.findById(checkAppliedCancellations[0].subscriberId)
      if (subscriber.planExpirationDate < new Date()) {
        subscriber.currentSubscriptionPlan = null;
        subscriber.planStartingDate = null;
        subscriber.planExpirationDate = null;
        subscriber.planStatus = PLAN_STATUS.CANCELLED;
        subscriber.currentSubscriptionPlanObject = {};
        subscriber.planCancelledAt = new Date();
        await subscriber.save();

        checkAppliedCancellations[i].status = PLAN_CANCELLATION_STATUS.CANCELLED;
        await checkAppliedCancellations[i].save();
      }
    }

    const expiredPlans = await this.getExpiredSubscriptions()
    for (let i = 0; i < expiredPlans.length; i++) {
      if (expiredPlans[i].planExpirationDate < new Date()) {
        expiredPlans[i].currentSubscriptionPlan = null;
        expiredPlans[i].planStartingDate = null;
        expiredPlans[i].planExpirationDate = null;
        expiredPlans[i].planStatus = PLAN_STATUS.CANCELLED;
        expiredPlans[i].planCancelledAt = new Date();
        await expiredPlans[i].save();
      }
    }

  }
  // Cron function for cancel Expired Subscriptions 
  async cancelExpiredSubscriptions() {
    try {
      const expiredSubscriptions = await this.userModel.updateMany(
        {
          planExpirationDate: { $lt: new Date() },
        },
        {
          $set: {
            status: false,
            planStatus: PLAN_STATUS.EXPIRED
          }
        });

      return expiredSubscriptions;
    } catch (e) {
    }
  }
  // Cron function for renewal/upgrade of the subscription package
  async renewUpgradeSubscriptions() {
    try {
      // Get all the requests that are activated by the admin
      const requests = await this.subscriptionRequestModel.find({ status: SUBSCRIPTION_REQUEST_STATUS.ACTIVE })
      for (let requestIndex in requests) {
        const subscriptionRequest = requests[requestIndex]
        // Fetch the manager from that request
        const manager = await this.userModel.findById(subscriptionRequest.subscriberId)
        if (manager) {
          // Update the subscription of that manager
          const checkSubscrition = await this.subscriptionPackageModel.findOne({
            _id: subscriptionRequest.subscriptionId,
            isDeleted: { $ne: true },
          });
          // If the manager plan has expired
          if (!manager.planExpirationDate || manager.planExpirationDate <= new Date() || manager.planStatus == PLAN_STATUS.EXPIRED) {
            manager.status = true
            manager.planStatus = PLAN_STATUS.ACTIVE
            manager.currentSubscriptionPlan = subscriptionRequest.subscriptionId
            manager.currentSubscriptionPlanObject = checkSubscrition
            manager.proofOfPayment = subscriptionRequest.proofOfPayment
            manager.planStartingDate = new Date()
            // manager.planExpirationDate = checkSubscrition.type === SUBSCRIPTION_PLAN_TYPES.MONTHLY ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            manager.planExpirationDate = this.calculateExpirationDate(new Date(), checkSubscrition.type)
            await manager.save();
            // Delete the subscription request
            await this.subscriptionRequestModel.deleteOne({ _id: subscriptionRequest._id })
          }
        }
      }
    } catch (e) {
    }

  }
}

