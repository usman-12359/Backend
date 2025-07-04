import { Controller, Post, Body, Get, Put, Delete, Param, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam,ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { ParcelService } from '../services/parcel.service'
import { ParcelSaveDto, ParcelUpdateDto, AssociateRecipientToParcelUpdateDto } from 'src/common/dtos/parcel.dto';
@ApiTags('Parcel')
@Controller('parcel')
export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}


  @Get('sendTestMessage')
  async sendTestWhatsapp( ): Promise<any> {
    return await this.parcelService.sendTestWhatsapp();
  }


  @Post('save-parcel')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save the parcel details' })
  @ApiBody({
    description: 'parcel details',
    type: ParcelSaveDto, // You need to define this DTO to describe the file upload
  })
  @ApiResponse({
    status: 200,
    description: 'Parcel saved successfully',
  })
  async saveParcel(@Body() parcelSaveDto: ParcelSaveDto): Promise<any> {
    return await this.parcelService.saveParcel(parcelSaveDto);
  }

  @Get(':condominiumID{/:unitID}')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'list parcels of unit' })
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
    description: 'Parcel fetched successfully',
  })
  async listParcel( 
    @Param('condominiumID') condominiumID: string,
    @Param('unitID') unitID: string,
  ): Promise<any> {
    unitID = unitID.replace(/{.*\}/g,'')
    return await this.parcelService.listParcels(condominiumID,unitID);
  }

  @Post('collect/:id')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update the parcel status' })
  @ApiParam({
    name: 'id',
    description: '_id  of the parcel',
  })
  @ApiResponse({
    status: 200,
    description: 'Parcel saved successfully',
  })
  async collectParcel( @Param('id') id: string,): Promise<any> {
    return await this.parcelService.collectParcel(id);
  }

  @Put('associate-recipient/:id')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'associate recipient to the parcel' })
  @ApiBody({
    description: 'payload to associate recipient to the parcel',
    type: AssociateRecipientToParcelUpdateDto
  })
  @ApiResponse({
    status: 200,
    description: 'Parcel updated successfully',
  })
  async associateRecipientToParcel( 
    @Param('id') id: string,
    @Body() associateRecipientToParcelUpdateDto: AssociateRecipientToParcelUpdateDto,
  ): Promise<any> {
    return await this.parcelService.associateRecipientToParcel(id, associateRecipientToParcelUpdateDto);
  }

  @Put(':id')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update the parcel' })
  @ApiBody({
    description: 'payload to update the parcel',
    type: ParcelUpdateDto
  })
  @ApiResponse({
    status: 200,
    description: 'Parcel saved successfully',
  })
  async updateParcel( 
    @Param('id') id: string,
    @Body() ParcelUpdateDto: ParcelUpdateDto,
  ): Promise<any> {
    return await this.parcelService.updateParcel(id, ParcelUpdateDto);
  }

  @Delete(':id')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete the parcel' })
  @ApiResponse({
    status: 200,
    description: 'Parcel deleted successfully',
  })
  async deleteParcel( 
    @Param('id') id: string
  ): Promise<any> {
    return await this.parcelService.deleteParcel(id);
  }
}

