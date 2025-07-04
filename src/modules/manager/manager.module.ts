import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagerService } from './services/manager.service';
import { ManagerController } from './controllers/manager.controller';
import { Subscriber, SubscriberSchema } from 'src/common/schema/subscriber.schema';
import { Condominium, CondominiumSchema } from 'src/common/schema/condominium.schema';
import { SubscriberSubscriptionCancellation, SubscriberSubscriptionCancellationSchema } from 'src/common/schema/subscriberSubscriptionCanellation.schema';
import { SubscriptionPackage, SubscriptionPackageSchema } from 'src/common/schema/subscriptionPackage.schema';
import { SubscriptionRequest, SubscriptionRequestSchema } from 'src/common/schema/subscriptionRequest.schema';
import { Unit, UnitSchema } from 'src/common/schema/unit.schema';
import { S3Service } from 'src/services/s3.service';
import { ManagerCron } from './manager.cron';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MailService } from 'src/services/mailtrap.service';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Subscriber.name, schema: SubscriberSchema},
        {name: Condominium.name, schema: CondominiumSchema},
        {name: SubscriptionPackage.name, schema: SubscriptionPackageSchema},
        {name: SubscriberSubscriptionCancellation.name, schema: SubscriberSubscriptionCancellationSchema},
        {name: SubscriptionRequest.name, schema: SubscriptionRequestSchema},
        {name: Unit.name, schema: UnitSchema}
    ]),
    NestjsFormDataModule
  ],
  controllers: [ManagerController],
  providers: [ManagerService, S3Service, ManagerCron, MailService],
  exports: [MongooseModule]
})
export class ManagerModule {}
