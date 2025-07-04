import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base, BaseSchema } from 'src/common/schema/abstract.schema';
export type EmailVerificationDocument = HydratedDocument<EmailVerification>;

@Schema()
export class EmailVerification extends Base {
  @Prop({ type: String, required: true })
  email: string;
  
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;
  
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
}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);

// Extend with BaseSchema for common fields
EmailVerificationSchema.add(BaseSchema);
