import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base, BaseSchema } from 'src/common/schema/abstract.schema';
import { SUBSCRIPTION_REQUEST_TYPES, SUBSCRIPTION_REQUEST_STATUS } from '../dtos/ENUM';
export type SubscriptionRequestDocument = HydratedDocument<SubscriptionRequest>;

@Schema()
export class SubscriptionRequest extends Base {
  
  @Prop({ type: String, required: true })
  subscriberId: string;
  
  @Prop({ type: String, required: false })
  subscriptionId: string;
  
  @Prop({
    type: String,
    enum: SUBSCRIPTION_REQUEST_TYPES,
    values: [ SUBSCRIPTION_REQUEST_TYPES.NEW, SUBSCRIPTION_REQUEST_TYPES.RENEWAL, SUBSCRIPTION_REQUEST_TYPES.UPGRADE ]
  })
  type: string;
  
  @Prop({
    type: String,
    enum: SUBSCRIPTION_REQUEST_STATUS,
    values: [ SUBSCRIPTION_REQUEST_STATUS.ACTIVE, SUBSCRIPTION_REQUEST_STATUS.PENDING ]
  })
  status: string;
  
  @Prop({ type: Date, required: false })
  expiryDate: Date;
  
  @Prop({
    type: {},
    required: false,
    default: null,
  })
  proofOfPayment: any;
  

}

export const SubscriptionRequestSchema = SchemaFactory.createForClass(SubscriptionRequest);

// Extend with BaseSchema for common fields
SubscriptionRequestSchema.add(BaseSchema);
