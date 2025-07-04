import { Routes } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { ManagerModule } from '../manager/manager.module';
import { SubscriptionPackageModule } from '../subscriptionPackage/subscriptionPackage.module';
import { UnitModule } from '../unit/unit.module';
import { RecipientModule } from '../recepient/recipient.module';
import { OcrModule } from '../ocr/ocr.module';
import { ParcelModule } from '../parcel/parcel.module';
import { ContactQueryModule } from '../contactQuery/contactQuery.module'; 

export const routes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'unit',
    module: UnitModule,
  },
  {
    path: 'manager',
    module: ManagerModule,
  },
  {
    path: 'ocr',
    module: OcrModule,
  },
  {
    path: 'subscription-package',
    module: SubscriptionPackageModule,
  },
  {
    path: 'recipient',
    module: RecipientModule,
  },
  {
    path: 'parcel',
    module: ParcelModule,
  },
  {
    path: 'contact',
    module: ContactQueryModule,
  },


];


