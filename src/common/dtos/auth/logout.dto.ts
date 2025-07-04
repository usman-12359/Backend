import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
} from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: "FCM Token",
  })
  @IsNotEmpty({ message: 'FCM token is required' })
  fcmToken: string;
  
  @ApiProperty({
    description: "User ID",
  })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
}
