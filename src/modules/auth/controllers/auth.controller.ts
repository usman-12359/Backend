import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordEmailDto,
  LoginDto,
} from 'src/common/dtos/auth';
import { AdminSeedDto, UpdateAdminProfileDto, UpdateAdminProfileImageDto, UpdateAdminPasswordDto } from 'src/common/dtos/adminSeed.dto';
import { AuthService } from '../services/auth.service';
import { Body, Post, Param } from '@nestjs/common';
import { VerifyEmailDto } from 'src/common/dtos/auth/verify-email.dto';
import { CreateAccountDto } from 'src/common/dtos/auth/create-account.dto';
import { CheckEmailDto } from 'src/common/dtos/auth/check-email.dto';
import { PasswordSetUserCreateDto } from '../../../common/dtos/auth/set-pasword-and-create-user.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { DecryptTokenInterceptor } from 'src/interceptors';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('seed-admin')
  // @ApiExcludeEndpoint() // This specific endpoint will be hidden in Swagger
  async seedAdmin(@Body() adminSeedDto: AdminSeedDto) {
    return await this.authService.seedAdmin(adminSeedDto);
  } 

  @Post('login')
  async logIn(@Body() loginDto: LoginDto): Promise<any> {
    const auth = await this.authService.login(loginDto);
    return auth;
  }

  @Post('sign-up')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<any> {
    const userSignup = await this.authService.signUp(createAccountDto);
    return userSignup;
  }

  @Post('verify-otp')
  async verifyOTP(@Body() verifyEmailDto: VerifyEmailDto): Promise<any> {
    const verifyOTP = await this.authService.verifyAccount(verifyEmailDto);
    return verifyOTP;
  }

  @Post('forgot-password-email')
  async forgotPasswordEmail(
    @Body() body: ForgotPasswordEmailDto,
  ): Promise<any> {
    const userSignup = await this.authService.forgotPasswordEmail(body);
    return userSignup;
  }

  @Post('set-password')
  async setPassword(
    @Body() passwordSetDto: PasswordSetUserCreateDto,
  ): Promise<any> {
    const setPassword = await this.authService.setPassword(passwordSetDto);
    return setPassword;
  }
  @Post('check-email')
  async checkEmail(
    @Body() checkEmailDto: CheckEmailDto,
  ): Promise<any> {
    const checkEmail = await this.authService.checkEmail(checkEmailDto);
    return checkEmail;
  }
  @Post('resend-otp')
  async resendOtp(
    @Body() checkEmailDto: CheckEmailDto,
  ): Promise<any> {
    const otpSent = await this.authService.resendOtp(checkEmailDto);
    return otpSent;
  }

  @Post('admin/edit/profile/:id')
  async adminEditProfile(
    @Body() updateAdminProfileDto: UpdateAdminProfileDto,
    @Param('id') id: string,
  ): Promise<any> {
    const response = await this.authService.updateAdminProfile(updateAdminProfileDto, id);
    return response;
  }

  @Post('admin/edit/profile-password/:id')
  async adminEditProfilePassword(
    @Body() updateAdminPasswordDto: UpdateAdminPasswordDto,
    @Param('id') id: string,
  ): Promise<any> {
    const response = await this.authService.updateAdminProfilePassword(updateAdminPasswordDto, id);
    return response;
  }

  @ApiBearerAuth()
  @UseInterceptors(DecryptTokenInterceptor)
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @Post('admin/edit/profile-image/:id')
  @ApiBody({
    description: 'Upload image',
    type: UpdateAdminProfileImageDto, // You need to define this DTO to describe the file upload
  })
  async adminEditProfileImage(
    @Body() updateAdminProfileImageDto: UpdateAdminProfileImageDto,
    @Param('id') id: string,
  ): Promise<any> {
    const response = await this.authService.updateAdminProfileImage(updateAdminProfileImageDto, id);
    return response;
  }
}
