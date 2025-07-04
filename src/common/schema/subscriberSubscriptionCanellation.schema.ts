import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base, BaseSchema } from 'src/common/schema/abstract.schema';
import { PLAN_CANCELLATION_STATUS } from 'src/common/constants/ENUM';

export type SubscriberSubscriptionCancellationDocument = HydratedDocument<SubscriberSubscriptionCancellation>;

@Schema()
export class SubscriberSubscriptionCancellation extends Base {
  
  @Prop({ type: String, required: true })
  subscriberId: string;
  
  @Prop({ type: String, required: false })
  subscriptionId: string;
  
  @Prop({
    type: String,
    enum: PLAN_CANCELLATION_STATUS,
    values: [PLAN_CANCELLATION_STATUS.APPLIED, PLAN_CANCELLATION_STATUS.CANCELLED],
    default: PLAN_CANCELLATION_STATUS.APPLIED,
  })
  status: string;
  
}

export const SubscriberSubscriptionCancellationSchema = SchemaFactory.createForClass(SubscriberSubscriptionCancellation);

// Extend with BaseSchema for common fields
SubscriberSubscriptionCancellationSchema.add(BaseSchema);
