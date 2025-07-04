import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParcelService } from './services/parcel.service';
import { ParcelController } from './controllers/parcel.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Parcel, ParcelSchema } from 'src/common/schema/parcel.schema';
import { Recipient, RecipientSchema } from 'src/common/schema/recipient.schema';
import { Unit, UnitSchema } from 'src/common/schema/unit.schema';
import { MailService } from 'src/services/mailtrap.service';
import { WhatsAppService } from 'src/services/whatsapp.service';
import { S3Service } from 'src/services/s3.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parcel.name, schema: ParcelSchema },
      { name: Recipient.name, schema: RecipientSchema },
      { name: Unit.name, schema: UnitSchema },
    ]),
    NestjsFormDataModule,
  ],
  controllers: [ParcelController],
  providers: [ParcelService, MailService, WhatsAppService, S3Service],
  exports: [MongooseModule]
})
export class ParcelModule {}
