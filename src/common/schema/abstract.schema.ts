import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Base extends Document {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
export type BaseDocument = Base & Document;

// Define the pre 'findOneAndUpdate' middleware to update the 'updatedAt' field
BaseSchema.pre<Base>('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
