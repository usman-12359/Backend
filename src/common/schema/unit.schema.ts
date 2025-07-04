import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from 'src/common/schema/abstract.schema';

export type UnitDocument = Unit & Document;

@Schema({ timestamps: true })
export class Unit extends Base {

  @Prop({ type: String, required: false })   // XXX.XXX.XXX (starting with the condominium Id ad later from 001
  unitId: string;                 // System generated
  
  @Prop({ type: String, required: false })  // Foregin Key
  condominiumID: string;                 // Foregin Key

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: Number, required: false, default: 0})
  numberOfRecipients: number;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

// Pre-save middleware for generating User ID
UnitSchema.pre<UnitDocument>('save', async function (next) {
  if (!this.unitId) {
    try {
      const startSequence = 1; // Starting point for series
      const UnitModel = this.constructor as mongoose.Model<UnitDocument>;
      const lastUnit = await UnitModel.findOne({ condominiumID: this.condominiumID }).sort({unitId: -1}); // Use the model to count documents for the specific condominium
      const lastUnitID = lastUnit ? lastUnit.unitId : this.condominiumID.toString()+".000" // If no unit
      const lastUnitIDToNumber = lastUnitID.split('.')[2]
      const nextID = parseInt(lastUnitIDToNumber) + 1;      
      this.unitId = `${this.condominiumID}.${nextID.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false })}`;
      next();
    } catch (error) {
      return next(error);
    }
  }


});
