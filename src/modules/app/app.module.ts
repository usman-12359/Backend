import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AuthModuleOptions } from '@nestjs/passport';
import { config } from 'src/config';
import { routes } from './routes';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '../auth/auth.module';
import { ManagerModule } from '../manager/manager.module';
import { UnitModule } from '../unit/unit.module';
import { RecipientModule } from '../recepient/recipient.module';
import { SubscriptionPackageModule } from '../subscriptionPackage/subscriptionPackage.module';
import { ContactQueryModule } from '../contactQuery/contactQuery.module';
import { OcrModule } from '../ocr/ocr.module';
import { ParcelModule } from '../parcel/parcel.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(config.DATABASE_LINK, {

      dbName: config.DATABASE_NAME,
    }),
    RouterModule.register(routes),
    ConfigModule.forRoot({ isGlobal: true }),
    MorganModule,
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
    AuthModule,
    ManagerModule,
    SubscriptionPackageModule,
    UnitModule,
    RecipientModule,
    OcrModule,
    ParcelModule,
    ContactQueryModule,
  ],
  controllers: [AppController], 
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AuthModuleOptions
  ],
})

export class AppModule {
  static port: number;
  static hostname: string;
  static isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = Number(process.env.PORT);
    AppModule.hostname = this.configService.get('APP_URL');
    AppModule.isProduction =
      this.configService.get('NODE_ENV') === 'production';
  }
}

