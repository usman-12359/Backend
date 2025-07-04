import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordEmailDto {
  @ApiProperty({
    example: 'muhammadmubeen12345@gmail.com',
    description: "User's email",
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
}
