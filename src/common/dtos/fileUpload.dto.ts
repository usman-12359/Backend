import { ApiProperty } from '@nestjs/swagger';
import { IsFileSizeValid } from 'src/common/dtos/fileSize.dto'
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile picture file to upload',
  })
  @IsNotEmpty({ message: 'Parcel Picture is required' })
  @IsFileSizeValid({
    message: 'File size exceeds the maximum allowed limit of 35 MB',
  })
  readonly file: Express.Multer.File;
}

export class RecipientFileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV filr to import',
  })
  file: Express.Multer.File
}

