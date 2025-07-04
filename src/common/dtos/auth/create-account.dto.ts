import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/common/constants/regexs.constant';

export class CreateAccountDto {
  @ApiProperty({
    example: 'test@email.com',
    description: "Email Address",
  })
  @IsNotEmpty({ message: 'Email Address is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "Password / Senha",
  })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
  
  @ApiProperty({
    example: 'Test Name',
    description: "Condominium Name",
  })
  @IsNotEmpty({ message: 'Condominium Name is required' })
  @IsString({ message: 'Condominium Name must be a string' })
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
  @IsNotEmpty({ message: 'Condominium Zip Code (CEP) is required' })
  @IsString({ message: 'Condominium Zip Code (CEP) must be a string' })
  readonly cep: string;
  
  @ApiProperty({
    example: 'xxxx-xx',
    description: "Logradouro",
  })
  @IsNotEmpty({ message: 'Logradouro is required' })
  @IsString({ message: 'Logradouro must be a string' })
  readonly logradouro: string;

  @ApiProperty({
    example: 'xxxx-xx',
    description: "Número",
  })
  @IsNotEmpty({ message: 'Número is required' })
  @IsString({ message: 'Número must be a string' })
  readonly numero: string;
  
  @ApiProperty({
    example: 'xxxx-xx',
    description: "Bairro",
  })
  @IsNotEmpty({ message: 'Bairro is required' })
  @IsString({ message: 'Bairro must be a string' })
  readonly bairro: string;
  
  @ApiProperty({
    example: 'xxxx-xx',
    description: "Cidade",
  })
  @IsNotEmpty({ message: 'Cidade is required' })
  @IsString({ message: 'Cidade must be a string' })
  readonly cidade: string;
  
  @ApiProperty({
    example: 'xxxx-xx',
    description: "Estado",
  })
  @IsNotEmpty({ message: 'Estado is required' })
  @IsString({ message: 'Estado must be a string' })
  readonly estado: string;
  
  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Complemento ( Condominium Address Line 2)",
  })
  @IsString({ message: 'Complemento ( Condominium Address Line 2) must be a string' })
  readonly complemento: string;
  
  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Phone Number",
  })
  @IsString({ message: 'Phone Number must be a string' })
  readonly telefone: string;
  
  
  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Cell Phone Number",
  })
  @IsString({ message: 'Cell Phone Number must be a string' })
  readonly celular: string;
  
  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "number Of Units In Condominium",
  })
  @IsNotEmpty({ message: 'number Of Units In Condominium is required' })
  readonly numberOfUnitsInCondominium: string;
  
  @ApiProperty({
    example: 'xxxxxxxxxx',
    description: "Gatehouse Password / Senha",
  })
  @IsNotEmpty({ message: 'Gatehouse Password is required' })
  readonly gatehousePassword: string;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: "Subscription ID",
  }) 
  @IsNotEmpty({ message: 'Subscription ID is required' })
  @IsString({ message: 'Subscription ID must be a string' })
  readonly subscriptionID: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Proof of payment to upload',
    required:false,
  })
  @IsOptional()
  readonly proofOfPayment: string;
}
