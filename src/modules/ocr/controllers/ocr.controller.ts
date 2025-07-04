import { Controller, Post, UseInterceptors, Request, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { FormDataRequest } from 'nestjs-form-data';
import { OcrService } from '../services/ocr.service'
import { FileUploadDto } from 'src/common/dtos/fileUpload.dto';

@ApiTags('OCR')
@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) { }

  @ApiBearerAuth()
  @UseInterceptors(DecryptTokenInterceptor)
  @FormDataRequest()
  @Post('upload/:subscriberId')
  @ApiBody({
    description: 'Upload image',
    type: FileUploadDto, // You need to define this DTO to describe the file upload
  })
  @ApiParam({
    name: 'subscriberId',
    description: 'ID of the subscriber',
    required: true,
  })
  @ApiOperation({ summary: 'Perform Ocr on the image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Ocr run successfully.' })
  async uploadFileAndRunOcr(
    @Param('subscriberId') subscriberId: string,
    @Request() request: any,
    @Body() body: FileUploadDto,
  ): Promise<any> {
    const user = request.user;
    return await this.ocrService.extractInformation(body, user, subscriberId);
  }
}

