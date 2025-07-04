import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { S3Service } from 'src/services/s3.service';
import { MailService } from 'src/services/mailtrap.service';
import { SeederService } from 'src/services/seeder.service';
import { Admin, AdminSchema } from 'src/common/schema/admin.schema';
import { Subscriber, SubscriberSchema } from 'src/common/schema/subscriber.schema';
import { Condominium, CondominiumSchema } from 'src/common/schema/condominium.schema';
import { SubscriptionPackage, SubscriptionPackageSchema } from 'src/common/schema/subscriptionPackage.schema';
import { SubscriptionRequest, SubscriptionRequestSchema } from 'src/common/schema/subscriptionRequest.schema';
import { EmailVerification, EmailVerificationSchema } from 'src/common/schema/emailVerification.schema';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Condominium.name, schema: CondominiumSchema },
      { name: SubscriptionPackage.name, schema: SubscriptionPackageSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema },
      { name: SubscriptionRequest.name, schema: SubscriptionRequestSchema },
    ]),
    NestjsFormDataModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_TOKEN_KEY'),
        signOptions: {
          expiresIn: String(configService.get('JWT_EXPIRES_IN')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, S3Service, MailService, SeederService],
  exports: [AuthService],
})
export class AuthModule {}
