import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { Transform } from 'class-transformer';


export class AssociateRecipientToParcelUpdateDto {
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    unitID: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    recipientID: string;
    
    
}
export class ParcelUpdateDto {
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // condominiumID: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    unitID: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    recipientID: string;
    
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // fullName: string;
    
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // addressCondominium: string;
    
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // addressUnit: string;
    
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // addressAppartmentNo: string;
    
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // addressOther: string;

    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // contact: string;

    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // email: string;
    
    // @ApiProperty()
    // @Transform(({ value }) => value?.trim())
    // type: string;
}
export class ParcelSaveDto {
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    condominiumID: string;
    
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    unitID: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    fullName: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    addressCondominium: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    addressUnit: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    addressAppartmentNo: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    addressOther: string;

    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    contact: string;

    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    email: string;
    
    @ApiProperty()
    @Transform(({ value }) => value?.trim())
    imageURL: string;
}
