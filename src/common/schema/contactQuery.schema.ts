import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from 'src/common/schema/abstract.schema';

export type ContactQueryDocument = ContactQuery & Document;

@Schema({ timestamps: true })
export class ContactQuery extends Base {

  @Prop({ required: true })
  firstName: string;
  
  @Prop({ required: false })
  lastName: string;
  
  @Prop({ required: false })
  email: string;
  
  @Prop({ required: false })
  contact: string;
  
  @Prop({ required: true })
  query: string;

}


export const ContactQuerySchema = SchemaFactory.createForClass(ContactQuery);
