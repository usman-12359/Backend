import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { AdminInterceptor } from 'src/interceptors/admin.interceptor';
import { UnitService } from '../services/unit.service'
import { UnitCreateDto, UnitUpdateDto } from 'src/common/dtos/unit.dto';
import { RecipientFileUploadDto } from 'src/common/dtos/fileUpload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Unit')
@Controller()
export class UnitController {
  constructor(private unitService: UnitService) { }

  ////////////////////// Unit Routes //////////////////////
  // Create a New Unit
  @UseInterceptors(DecryptTokenInterceptor)
  @Post('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Unit' })
  @ApiBody({
    description: 'Payload to create a new Unit',
    type: UnitCreateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit created successfully',
  })
  async createUnit(
    @Body() UnitCreateDto: UnitCreateDto,
  ) {
    return await this.unitService.createUnit(UnitCreateDto);
  }

  // List all Units
  @UseInterceptors(DecryptTokenInterceptor)
  @Get(':condominiumID')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all Units' })
  @ApiParam({
    name: 'condominiumID',
    description: 'ID of the condominium xxx.xxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Units listed successfully',
  })
  async listUnits(
    @Param('condominiumID') condominiumID: string,
  ) {
    return await this.unitService.listUnits(condominiumID);
  }

  // Update a Unit
  @UseInterceptors(DecryptTokenInterceptor)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Unit' })
  @ApiBody({
    description: 'Payload to update a Unit',
    type: UnitUpdateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Unit updated successfully',
  })
  async updateUnit(
    @Param('id') id: string,
    @Body() UnitUpdateDto: UnitUpdateDto,
  ) {
    return await this.unitService.updateUnit(id, UnitUpdateDto);
  }

  // Delete a Unit
  @UseInterceptors(DecryptTokenInterceptor)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Unit' })
  @ApiResponse({
    status: 200,
    description: 'Unit deleted successfully',
  })
  async deleteUnit(
    @Param('id') id: string,
  ) {
    return await this.unitService.deleteUnit(id);
  }

  // Import Units

  @Post('import/:condominiumID')
  @UseInterceptors(DecryptTokenInterceptor)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './units',
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
  @ApiOperation({ summary: 'Import Units from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload csv file',
    type: RecipientFileUploadDto, // You need to define this DTO to describe the file upload
  })
  @ApiResponse({
    status: 200,
    description: 'Units imported successfully',
  })
  async importRecipients(
    @UploadedFile() file: Express.Multer.File,
    @Param('condominiumID') condominiumID: string
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    console.log('file', file)
    return await this.unitService.importUnits(file, condominiumID);
  }
}

