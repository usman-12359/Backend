import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OcrService } from './services/ocr.service';
import { OcrController } from './controllers/ocr.controller';
import { ImageService } from 'src/services/image.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Subscriber, SubscriberSchema } from 'src/common/schema/subscriber.schema';
import { Admin, AdminSchema } from 'src/common/schema/admin.schema';
import { Unit, UnitSchema } from 'src/common/schema/unit.schema';
import { Condominium, CondominiumSchema } from'src/common/schema/condominium.schema';
import { S3Service } from 'src/services/s3.service';
import { ParcelService } from 'src/modules/parcel/services/parcel.service';
import { Parcel, ParcelSchema } from 'src/common/schema/parcel.schema';
import { MailService } from 'src/services/mailtrap.service';
import { WhatsAppService } from 'src/services/whatsapp.service';
import { Recipient, RecipientSchema } from 'src/common/schema/recipient.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Parcel.name, schema: ParcelSchema },
      { name: Recipient.name, schema: RecipientSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Condominium.name, schema: CondominiumSchema },
    ]),
    NestjsFormDataModule,
  ],
  controllers: [OcrController],
  providers: [OcrService, ImageService, S3Service, ParcelService, MailService, WhatsAppService],
  exports: [MongooseModule]
})
export class OcrModule {}
