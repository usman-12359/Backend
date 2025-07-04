import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SubscriptionPackageCreateDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  baseRetailPrice: number;
  
  @ApiProperty()
  @IsNotEmpty()
  retailPricePerTenUnit: number;

  @ApiProperty()
  @IsNotEmpty()
  baseLaunchPrice: number;
  
  @ApiProperty()
  @IsNotEmpty()
  launchPricePerTenUnit: number;

  @ApiProperty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  active: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

}
export class SubscriptionPackageUpdateDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  baseRetailPrice: number;
  
  @ApiProperty()
  @IsNotEmpty()
  retailPricePerTenUnit: number;

  @ApiProperty()
  @IsNotEmpty()
  baseLaunchPrice: number;
  
  @ApiProperty()
  @IsNotEmpty()
  launchPricePerTenUnit: number;

  @ApiProperty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  active: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

}