import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, UploadedFile, HttpException, HttpStatus} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { RecipientService } from '../services/recipient.service'
import { RecipientCreateDto, RecipientUpdateDto } from 'src/common/dtos/recipient.dto';
import { RecipientFileUploadDto } from 'src/common/dtos/fileUpload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Recipient')
@Controller()
export class RecipientController {
  constructor(private recipientService: RecipientService) {}

  ////////////////////// Recipient Routes //////////////////////
  // Create a New Recipient
  @UseInterceptors(DecryptTokenInterceptor)
  @Post('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Recipient' })
  @ApiBody({
    description: 'Payload to create a new Recipient',
    type: RecipientCreateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Recipient created successfully',
  })
  async createRecipient(
    @Body() RecipientCreateDto: RecipientCreateDto,
  ) {
    return await this.recipientService.createRecipient(RecipientCreateDto);
  }

  // List all Recipients
  @UseInterceptors(DecryptTokenInterceptor)
  @Get(':condominiumID{/:unitID}')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all Recipients' })
  @ApiParam({
    name: 'condominiumID',
    description: 'ID of the condominium xxx.xxx',
    required: true,
  })
  @ApiParam({
    name: 'unitID',
    description: 'ID of the unit xxx.xxx.xxx',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Recipients listed successfully',
  })
  async listRecipients(
    @Param('condominiumID') condominiumID: string,
    @Param('unitID') unitID: string,
  ) {
    unitID = unitID.replace(/{.*\}/g,'')
    return await this.recipientService.listRecipients(condominiumID,unitID);
  }

  // Update a Recipient
  @UseInterceptors(DecryptTokenInterceptor)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Recipient' })
  @ApiBody({
    description: 'Payload to update a Recipient',
    type: RecipientUpdateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Recipient updated successfully',
  })
  async updateRecipient(
    @Param('id') id: string,
    @Body() RecipientUpdateDto: RecipientUpdateDto,
  ) {
    return await this.recipientService.updateRecipient(id, RecipientUpdateDto);
  }

  // Delete a Recipient
  @UseInterceptors(DecryptTokenInterceptor)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Recipient' })
  @ApiResponse({
    status: 200,
    description: 'Recipient deleted successfully',
  })
  async deleteRecipient(
    @Param('id') id: string,
  ) {
    return await this.recipientService.deleteRecipient(id);
  }

  @Post('import/:condominiumID')
  @UseInterceptors(DecryptTokenInterceptor)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './recipients',
      filename: (req, file, cb) => {
        if (extname(file.originalname) !== '.csv') {
          return cb(null, 'Only CSV files are allowed');
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Import Recipients from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload csv file',
    type: RecipientFileUploadDto, // You need to define this DTO to describe the file upload
  })
  @ApiResponse({
    status: 200,
    description: 'Recipients imported successfully',
  })
  async importRecipients(
    @UploadedFile() file: Express.Multer.File,
    @Param('condominiumID') condominiumID:string
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    console.log('file', file)
    return await this.recipientService.importRecipients(file, condominiumID);
  }
}

