import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Schema as MongooseSchema,
} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Base, BaseSchema } from 'src/common/schema/abstract.schema';
export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin extends Base {
  @Prop({ type: String, required: true })
  fullName: string;
  
  @Prop({ type: String, required: true })
  email: string;
  
  @Prop({ type: String, required: false })
  phoneNumber: string;
  
  @Prop({ type: String, required: true })
  password: string;

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

  @Prop({
    type: {},
    required: false,
    default: null,
  })
  profilePicture: any;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// Pre-save middleware for generating User ID
AdminSchema.pre<AdminDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

AdminSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Extend with BaseSchema for common fields
AdminSchema.add(BaseSchema);
