import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Base, BaseSchema } from 'src/common/schema/abstract.schema';
import { USER_ROLES, PLAN_STATUS } from 'src/common/constants/ENUM';
export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema()
export class Subscriber extends Base {
  @Prop({ type: String, required: true })
  email: string;
  
  @Prop({ type: String, required: false })
  password: string;
  
  @Prop({ type: String, required: false })
  gateHousePassword: string;
  
  @Prop({ type: String, required: false })
  cellPhoneNumber: string;
  
  @Prop({ type: String, required: false })
  phoneNumber: string;
  
  @Prop({ type: String, required: false })              // XX.XXX.XXX/XXXX-XX
  cnjp: string;
  
  
  @Prop({ type: Date, required: false })
  signatureDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: false,
  })
  currentSubscriptionPlan: string;
  
  @Prop({type: Object})
  currentSubscriptionPlanObject: any;

  @Prop({
    type: {},
    required: false,
    default: null,
  })
  proofOfPayment: any;

  @Prop({
    type: String,
    enum: PLAN_STATUS,
    values: [ PLAN_STATUS.ACTIVE, PLAN_STATUS.EXPIRED, PLAN_STATUS.PENDING, PLAN_STATUS.CANCELLED ],
    default: PLAN_STATUS.PENDING,
  })
  planStatus: string;

  @Prop({ type: Date, required: false })
  planStartingDate: Date;
  
  @Prop({ type: Date, required: false })
  planExpirationDate: Date;
  
  @Prop({ type: Date, required: false })
  planCancelledAt: Date;

  @Prop({ type: String, required: false })
  fullName: string;
  
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;
  
  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({
    type: String,
    enum: USER_ROLES,
    values: [USER_ROLES.DOORKEEPER, USER_ROLES.MANAGER, USER_ROLES.ADMIN],
    default: USER_ROLES.DOORKEEPER,
  })
  role: string;

  @Prop({
    type: Number,
    required: false,
  })
  otp: number;

  @Prop({
    type: Number,
    required: false,
  })
  forgetPasswordOTP: number;

  @Prop({
    type: {},
    required: false,
    default: null,
  })
  profilePicture: {};

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Condominium',
    required: true,
  })
  condominium: string;

}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);

// Pre-save middleware for generating User ID
SubscriberSchema.pre<SubscriberDocument>('save', async function (next) {
  if (!this.isModified('password') && !this.isModified('gateHousePassword')) {
    return next();
  }
  try {
    if(this.isModified('password')){
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
    }
    if(this.isModified('gateHousePassword')){
      const saltRounds = 10;
      const hashedgateHousePassword = await bcrypt.hash(this.gateHousePassword, saltRounds);
      this.gateHousePassword = hashedgateHousePassword;
    }

    next();
  } catch (error) {
    return next(error);
  }
});

SubscriberSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
SubscriberSchema.methods.validateGatehousePassword = async function (
  gateHousePassword: string,
): Promise<boolean> {
  return bcrypt.compare(gateHousePassword, this.gateHousePassword);
};

// Extend with BaseSchema for common fields
SubscriberSchema.add(BaseSchema);
