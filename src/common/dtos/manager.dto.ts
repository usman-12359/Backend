import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsBoolean,
  IsNotEmpty
} from 'class-validator';
import { IsFileSizeValid } from './fileSize.dto';

export class ManagerCreateDto {
  @ApiProperty({
    example: 'test@email.com',
    description: "Email Address",
  })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "Password / Senha",
  })
  readonly password: string;

  
  @ApiProperty({})
  readonly planExpirationDate: Date;
  
  @ApiProperty({
    example: 'Test Name',
    description: "Condominium Name",
  })
  readonly condominiumName: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "CNPJ",
  })
  cnjp: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Condominium Zip Code (CEP)",
  })
  readonly cep: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Logradouro",
  })
  readonly logradouro: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Número",
  })
  readonly numero: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Bairro",
  })
  readonly bairro: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Cidade",
  })
  readonly cidade: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Estado",
  })
  readonly estado: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Complemento ( Condominium Address Line 2)",
  })
  readonly complemento: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Phone Number",
  })
  readonly telefone: string;


  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Cell Phone Number",
  })
  readonly celular: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "Gatehouse Password / Senha",
  })
  readonly gatehousePassword: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Subscription ID",
  })
  readonly subscriptionID: string;

  
  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "number Of Units In Condominium",
  })
  @IsNotEmpty({ message: 'number Of Units In Condominium is required' })
  readonly numberOfUnitsInCondominium: number;
}
export class ManagerUpdateDto {
  @ApiProperty({
    example: 'test@email.com',
    description: "Email Address",
  })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "Password / Senha",
  })
  readonly password: string;

  @ApiProperty({
    example: 'Test Name',
    description: "Condominium Name",
  })
  readonly condominiumName: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "CNPJ",
  })
  cnjp: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Condominium Zip Code (CEP)",
  })
  readonly cep: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Logradouro",
  })
  readonly logradouro: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Número",
  })
  readonly numero: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Bairro",
  })
  readonly bairro: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Cidade",
  })
  readonly cidade: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Estado",
  })
  readonly estado: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Complemento ( Condominium Address Line 2)",
  })
  readonly complemento: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Phone Number",
  })
  readonly telefone: string;


  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Cell Phone Number",
  })
  readonly celular: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "Gatehouse Password / Senha",
  })
  readonly gatehousePassword: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Subscription ID",
  })
  readonly subscriptionID: string;

  @ApiProperty({
    example: 'true',
    description: "Plan Status ( tru/false)",
  })
  readonly planStatus: string;

  @ApiProperty({
    example: 'true',
    description: "User Status (true/false)",
  })
  @IsBoolean({ message: 'User Status must be a boolean' })
  readonly userStatus: boolean;

  @ApiProperty({})
  readonly planExpirationDate: Date;

  
  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "number Of Units In Condominium",
  })
  @IsNotEmpty({ message: 'number Of Units In Condominium is required' })
  readonly numberOfUnitsInCondominium: number;
}
export class UploadProofOfPaymentDto {
  @ApiProperty({
    type: 'string', 
    format: 'binary',
    description: 'proof of payment',
    required: false
  })
  @IsFileSizeValid({
    message: 'File size exceeds the maximum allowed limit of 35 MB',
  })
  readonly file?: string;
}