import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactQueryService } from './services/contactQuery.service';
import { ContactQueryController } from './controllers/contactQuery.controller';
import { ContactQuery, ContactQuerySchema } from 'src/common/schema/contactQuery.schema';
import { MailService } from 'src/services/mailtrap.service';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: ContactQuery.name, schema: ContactQuerySchema}
    ]),
  ],
  controllers: [ContactQueryController],
  providers: [ContactQueryService, MailService],
  exports: [MongooseModule]

})
export class ContactQueryModule {}
