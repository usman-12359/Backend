import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';


export class LoginDto {
  @ApiProperty({
    example: 'muhammadmubeen12345@gmail.com',
    description: "User's email",
  })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @ApiProperty({
    type: String,
    example: 'Abcd@123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string;
}
