import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { ContactQueryService } from '../services/contactQuery.service'
import { ContactQueryDto } from 'src/common/dtos/contactQuery.dto';



@ApiTags('Contact Query')
@Controller()
export class ContactQueryController {
  constructor(private contactQueryService: ContactQueryService) {}

  ////////////////////// contact Query Routes //////////////////////
  // Submit a Query
  @Post('')
  @ApiOperation({ summary: 'Submit a contact Query' })
  @ApiBody({
    description: 'Payload to subimt contact Query',
    type: ContactQueryDto,
  })

  @ApiResponse({
    status: 200,
    description: 'Contact Query submitted',
  })
  async submitQuery(
    @Body() contactQueryDto: ContactQueryDto,
  ) {
    return await this.contactQueryService.submitQuery(contactQueryDto);
  }

}

