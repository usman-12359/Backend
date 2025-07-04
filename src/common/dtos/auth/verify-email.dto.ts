import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsString,
  IsEmail,
  IsEmpty,
  IsBoolean,
} from 'class-validator';

const OTP_REGEX = /^[0-9]{4}$/;

export class VerifyEmailDto {
  @ApiProperty({
    example: 'muhammadmubeen12345@gmail.com',
    description: "User's email",
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '1234',
  })
  @IsNotEmpty({ message: 'otp is required' })
  @IsString({ message: 'otp must be a string' })
  @Matches(OTP_REGEX, { message: 'otp must be a 4-digit number' })
  readonly otp: number;

  @ApiProperty({
    description: 'Indicates whether the request is for forgot password',
    example: true, // Provide an example value
    required: true, // Mark as required if necessary
  })
  @IsBoolean()
  isForgotPassword: boolean;
}
