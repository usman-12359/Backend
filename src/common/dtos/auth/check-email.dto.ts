import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
} from 'class-validator';


export class CheckEmailDto {
  @ApiProperty({
    example: 'muhammadmubeen12345@gmail.com',
    description: "User's email",
  })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

}
