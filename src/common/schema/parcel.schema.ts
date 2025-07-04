import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from 'src/common/schema/abstract.schema';
import { NOTIFICATION_STATUS, PARCEL_TYPE } from '../constants/ENUM';

export type ParcelDocument = Parcel & Document;

@Schema({ timestamps: true })
export class Parcel extends Base {

  @Prop({ type: String, required: false })   // XXX.XXX.XXX.XXX (starting with the unit Id ad later from 001
  parcelId: string;                 // System generated
  
  @Prop({ type: String, required: false })  // Foregin Key
  condominiumID: string;                 // Foregin Key with condominiumID
  
  @Prop({ type: String, required: false })  // Foregin Key
  unitID: string;                 // Foregin Key with unitID
  
  @Prop({ type: String, required: false })  // Foregin Key
  recipientID: string;                 // Foregin Key with _id
  
  @Prop({ type: String, required: false })  
  fullName: string;                 

  @Prop({ type: String, required: false })  
  addressCondominium: string;                 
  
  @Prop({ type: String, required: false })  
  addressUnit: string;                 
  
  @Prop({ type: String, required: false })  
  addressAppartmentNo: string;                 
  
  @Prop({ type: String, required: false })  
  addressOther: string;                 
  
  @Prop({ type: String, required: false })  
  contact: string;                 
  
  @Prop({ type: String, required: false })  
  email: string;                 

  @Prop({
    type: String,
    enum: NOTIFICATION_STATUS,
    values: [NOTIFICATION_STATUS.NOTIFIED, NOTIFICATION_STATUS.PENDING, null],
    default: null,
  })
  notificationStatus: string;
  
  @Prop({
    type: String,
    enum: PARCEL_TYPE,
    values: [PARCEL_TYPE.COLLECTED, PARCEL_TYPE.NOT_COLLECTED, PARCEL_TYPE.UNASSIGNED],
    default: null,
  })
  type: string;

  @Prop({ type: Date, required: false })  
  registrationDate: string;                 
  
  @Prop({ type: Date, required: false, default: null })  
  collectionDate: string;         

  @Prop({ type: String, required: false, default: null })  
  imageURL: string;                 
}

export const ParcelSchema = SchemaFactory.createForClass(Parcel);

// Pre-save middleware for generating User ID
ParcelSchema.pre<ParcelDocument>('save', async function (next) {
  if (!this.parcelId) {
    try {
      const startSequence = 1; // Starting point for series

      const ParcelModel = this.constructor as mongoose.Model<ParcelDocument>;
      const lastParcel = await ParcelModel.findOne({ condominiumID: this.condominiumID }).sort({parcelId:-1}).collation({locale: "en_US", numericOrdering: true}); 
      const nextID = lastParcel ? 1 + parseInt(lastParcel.parcelId) : startSequence; 
      this.parcelId = nextID.toString();

      next();
    } catch (error) {
      return next(error);
    }
  }


});
