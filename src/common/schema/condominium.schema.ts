import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from 'src/common/schema/abstract.schema';

export type CondominiumDocument = Condominium & Document;

@Schema({ timestamps: true })
export class Condominium extends Base {


  @Prop({ type: String, required: false })   // XXX.XXX (starting on 100.001 for the first paying costumer)
  condominiumID: string;                 // System generated

  @Prop({ type: String, required: false })              // XX.XXX-XXX
  condominiumZipCode: string;

  @Prop({ type: String, required: false })
  condominiumName: string;

  @Prop({ type: String, required: false })              // (Field autocompletion using the CEP list — field remains editable) 
  condominiumAddressLine1_1of3: string;

  @Prop({ type: String, required: false })
  condominiumAddressLine1_2of3: string;

  @Prop({ type: String, required: false })
  condominiumAddressLine2: string;

  @Prop({ type: String, required: false })              // (Field autocompletion using the CEP list — field remains editable)
  condominiumAddressLine1_3of3: string

  @Prop({ type: String, required: false })
  city: string;

  @Prop({ type: String, required: false })
  streetNumber: string;

  @Prop({ type: String, required: false })
  state: string;

  @Prop({ type: Number, required: false })
  numberOfUnitsInCondominium: number;

  @Prop({ type: Number, required: false })
  numberOfRegisteredUnits: number;
}

export const CondominiumSchema = SchemaFactory.createForClass(Condominium);

// Pre-save middleware for generating User ID
CondominiumSchema.pre<CondominiumDocument>('save', async function (next) {
  if (!this.condominiumID) {
    try {
      const CondominiumModel = this.constructor as mongoose.Model<CondominiumDocument>;
      const lastCondo = await CondominiumModel.findOne().sort({ condominiumID: -1 }); // Use the model to fetch last added document
      const lastCondominiumID = lastCondo ? lastCondo.condominiumID : "100.000" // If no condominiums
      const lastCondominiumIDToNumber = lastCondominiumID.split('.').join('')
      const nextID = parseInt(lastCondominiumIDToNumber) + 1;
      this.condominiumID = nextID.toLocaleString('en-US', {
        minimumIntegerDigits: 6,
        useGrouping: false
      }).slice(0, 3) + '.' + nextID.toLocaleString('en-US', {
        minimumIntegerDigits: 6,
        useGrouping: false
      }).slice(3);
      next();
    } catch (error) {
      return next(error);
    }
  }


});
