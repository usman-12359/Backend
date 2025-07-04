import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString
} from 'class-validator';
import { Transform } from 'class-transformer';

export class DoorkeeperCreateDto {
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
  @IsString()
  password: string;
  
  @ApiProperty()
  @IsString()
  address: string;
  
  @ApiProperty()
  @IsString()
  dateOfBirth: string;

}
export class DoorkeeperUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  fullName: string;
   
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
  
  @ApiProperty()
  @IsString()
  address: string;
  
  @ApiProperty()
  @IsString()
  dateOfBirth: string;

}
