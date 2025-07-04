import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from 'src/common/schema/abstract.schema';
import { SUBSCRIPTION_PLAN_TYPES } from '../constants/ENUM';

export type SubscriptionPackageDocument = SubscriptionPackage & Document;

@Schema({ timestamps: true })
export class SubscriptionPackage extends Base {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  baseRetailPrice: number;
  
  @Prop({ required: true })
  retailPricePerTenUnit: number;
  
  @Prop({ required: true })
  baseLaunchPrice: number;

  @Prop({ required: true })
  launchPricePerTenUnit: number;

  @Prop({ required: true })
  details: string;

  @Prop({ required: false, default: true })
  active: boolean;

  @Prop({ required: true, enum: SUBSCRIPTION_PLAN_TYPES, default: SUBSCRIPTION_PLAN_TYPES.MONTHLY })
  type: string;
}


export const SubscriptionPackageSchema = SchemaFactory.createForClass(SubscriptionPackage);
