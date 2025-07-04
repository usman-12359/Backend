import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from 'src/common/schema/abstract.schema';
import { NOTIFICATION_TYPES, PLAN_STATUS } from 'src/common/constants/ENUM';

export type RecipientDocument = Recipient & Document;

@Schema({ timestamps: true })
export class Recipient extends Base {

  @Prop({ type: String, required: false })   
  recipientID: string;                 // System generated
  
  @Prop({ type: String, required: false })  // Foregin Key
  condominiumID: string;                 // Foregin Key

  @Prop({ type: String, required: false })  // Foregin Key
  unitID: string;                 // Foregin Key

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  email: string;
  
  @Prop({ type: String, required: false })
  whatsapp: string;

  @Prop({
    type: String,
    enum: NOTIFICATION_TYPES,
    values: [NOTIFICATION_TYPES.WHATSAPP, NOTIFICATION_TYPES.EMAIL, NOTIFICATION_TYPES.BOTH],
    default: NOTIFICATION_TYPES.WHATSAPP,
  })
  notificationType: string;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);

// Pre-save middleware for generating User ID
RecipientSchema.pre<RecipientDocument>('save', async function (next) {
  if (!this.recipientID) {
    try {
      const startSequence = 1; // Starting point for series
      const RecipientModel = this.constructor as mongoose.Model<RecipientDocument>;
      const lastRecipient = await RecipientModel.findOne({ unitID: this.unitID }).sort({recipientID: -1}).collation({locale: "en_US", numericOrdering: true}); // Use the model to count documents for the specific condominium
      const nextID = lastRecipient ? parseInt(lastRecipient.recipientID) + 1 : 1; // Increment based on count of documents
      this.recipientID = nextID.toString();
      next();
    } catch (error) {
      return next(error);
    }
    if (this.isModified('whatsapp') && this.whatsapp && !this.whatsapp.startsWith('55')) {
      this.whatsapp = `55${this.whatsapp}`;
    }
  }
});
