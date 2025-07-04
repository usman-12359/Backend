import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { SubscriptionPackageService } from '../services/subscriptionPackage.service'
import { SubscriptionPackageCreateDto, SubscriptionPackageUpdateDto } from 'src/common/dtos/subscriptionPackage.dto';



@ApiTags('Subscription Package')
@Controller()
export class SubscriptionPackageController {
  constructor(private subscriptionPackageService: SubscriptionPackageService) {}

  ////////////////////// Subscription Package Routes //////////////////////
  // Create a New Subscription Package
  // @UseInterceptors(DecryptTokenInterceptor, AdminInterceptor)
  @Post('')
  @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subscription package' })
  @ApiBody({
    description: 'Payload to create a new subscription package',
    type: SubscriptionPackageCreateDto,
  })

  @ApiResponse({
    status: 200,
    description: 'Subscription package created successfully',
  })
  async createSubscriptionPackage(
    @Body() subscriptionPackageCreateDto: SubscriptionPackageCreateDto,
  ) {
    return await this.subscriptionPackageService.createSubscriptionPackage(subscriptionPackageCreateDto);
  }


  // List all subscription packages
  @Get('')
  // @UseInterceptors(DecryptTokenInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all subscription packages' })
  @ApiResponse({
    status: 200,
    description: 'Subscription packages listed successfully',
  })

  async listSubscriptionPackages(
  ) {
    return await this.subscriptionPackageService.listSubscriptionPackages();
  }


  // Update a Subscription Package
  @UseInterceptors(DecryptTokenInterceptor)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subscription package' })

  @ApiBody({
    description: 'Payload to update a subscription package',
    type: SubscriptionPackageUpdateDto,
  })

  @ApiResponse({
    status: 200,
    description: 'Subscription package updated successfully',
  })
  async updateSubscriptionPackage(

    @Param('id') id: string,
    @Body() subscriptionPackageUpdateDto: SubscriptionPackageUpdateDto,
  ) {
    return await this.subscriptionPackageService.updateSubscriptionPackage(id, subscriptionPackageUpdateDto);
  }


  // Delete a Subscription Package
  @UseInterceptors(DecryptTokenInterceptor)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subscription package' })

  @ApiResponse({
    status: 200,
    description: 'Subscription package deleted successfully',
  })

  async deleteSubscriptionPackage(
    @Param('id') id: string,
  ) {
    return await this.subscriptionPackageService.deleteSubscriptionPackage(id);
  }

}

