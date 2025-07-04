import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_REGEX } from 'src/common/constants/regexs.constant';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class PasswordSetUserCreateDto {
  @ApiProperty({
    type: String,
    example: 'Abcd@123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one special character, one number, one uppercase character, and be between 8 to 16 characters',
  })
  readonly password: string;

  @ApiProperty({
    example: 'muhammadmubeen12345@gmail.com',
    description: "User's email",
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
}
