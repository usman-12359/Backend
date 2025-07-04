import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ContactQueryDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  firstName: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  lastName: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  email: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  contact: string;
  
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  query: string;
}