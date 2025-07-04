import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsFileSizeValid } from './fileSize.dto';

export class AdminSeedDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  fullName: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  email: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  phoneNumber: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  password: string;
}
export class UpdateAdminProfileImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile picture file to upload',
  })
  @IsNotEmpty({ message: 'Profile picture is required' })
  @IsFileSizeValid({
    message: 'File size exceeds the maximum allowed limit of 35 MB',
  })
  readonly file: string;
}
export class UpdateAdminProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  fullName: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  email: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  phoneNumber: string;
}

export class UpdateAdminPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  currentPassword: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  newPassword: string;
}