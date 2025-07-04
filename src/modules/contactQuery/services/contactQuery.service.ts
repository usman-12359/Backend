import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactQueryDocument, ContactQuery } from 'src/common/schema/contactQuery.schema';
import { BaseService } from 'src/services/base.service';
import { ContactQueryDto } from 'src/common/dtos/contactQuery.dto';
import { MailService } from 'src/services/mailtrap.service';
import * as EmailTemplate from 'src/utils/email-templates';

@Injectable()
export class ContactQueryService extends BaseService<
  ContactQuery,
  ContactQueryDocument
> {
  constructor(
    @InjectModel(ContactQuery.name)
    private readonly contactQueryModel: Model<ContactQueryDocument>,
    private readonly mailService: MailService,
  ) {
    super(contactQueryModel);
  }

  // Enviar uma Nova Consulta de Contato
  async submitQuery(contactQueryDto: ContactQueryDto) {
    const ContactQuery = await this.contactQueryModel.create({ ...contactQueryDto });
    let data = EmailTemplate.contactQueryReceived(ContactQuery.firstName+' '+ContactQuery.lastName);
    await this.mailService.sendMail(ContactQuery.email, data.SUBJECT, data.HTML);
    
    data = EmailTemplate.contactQueryReceivedAdmin(ContactQuery);
    await this.mailService.sendMail('suporte@chegousuaencomenda.com.br', data.SUBJECT, data.HTML);
    
    return ContactQuery;
  }
}

