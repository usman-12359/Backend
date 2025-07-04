import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionPackageService } from './services/subscriptionPackage.service';
import { SubscriptionPackageController } from './controllers/subscriptionPackage.controller';
import { SubscriptionPackage, SubscriptionPackageSchema } from 'src/common/schema/subscriptionPackage.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: SubscriptionPackage.name, schema: SubscriptionPackageSchema}
    ]),
  ],
  controllers: [SubscriptionPackageController],
  providers: [SubscriptionPackageService],
  exports: [MongooseModule]

})
export class SubscriptionPackageModule {}
