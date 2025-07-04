import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { DecryptTokenInterceptor } from 'src/interceptors';
import { ManagerService } from '../services/manager.service'
import { ManagerCreateDto, ManagerUpdateDto, UploadProofOfPaymentDto } from 'src/common/dtos/manager.dto';
import { FormDataRequest } from 'nestjs-form-data';

@ApiTags('Manager')
@Controller()
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  ////////////////////// Manager Routes //////////////////////
  // Create a New Manager
  @UseInterceptors(DecryptTokenInterceptor)
  @Post('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new manager' })
  @ApiBody({
    description: 'Payload to create a new manager',
    type: ManagerCreateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Manager created successfully',
  })
  async createManager(
    @Body() managerCreateDto: ManagerCreateDto,
  ) {
    return await this.managerService.createManager(managerCreateDto);
  }
  // List all managers
  @UseInterceptors(DecryptTokenInterceptor)
  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all managers' })
  @ApiResponse({
    status: 200,
    description: 'Managers listed successfully',
  })
  async listManagers(
  ) {
    return await this.managerService.listManagers();
  }
  // Update an Manager
  @UseInterceptors(DecryptTokenInterceptor)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a manager' })
  @ApiResponse({
    status: 200,
    description: 'Manager created successfully',
  })
  async getManager(
    @Param('id') id: string,
  ) {
    return await this.managerService.getManager(id);
  }
  // Update an Manager
  @UseInterceptors(DecryptTokenInterceptor)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a manager' })
  @ApiBody({
    description: 'Payload to update a manager',
    type: ManagerUpdateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Manager created successfully',
  })
  async updateManager(
    @Param('id') id: string,
    @Body() managerUpdateDto: ManagerUpdateDto,
  ) {
    return await this.managerService.updateManager(id, managerUpdateDto);
  }
  
  // Delete an Manager
  @UseInterceptors(DecryptTokenInterceptor)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a manager' })
  @ApiResponse({
    status: 200,
    description: 'Manager deleted successfully',
  })
  async deletemanager(
    @Param('id') id: string,
  ) {
    return await this.managerService.deleteManager(id);
  }

  // Cancel Subscription
  @UseInterceptors(DecryptTokenInterceptor)
  @Put('cancel-subscription/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel the current Subscription of the manager' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
  })
  async cancelSubscription(
    @Param('id') id: string,
  ) {
    return await this.managerService.cancelSubscription(id);
  }

  // Update Subscription
  @UseInterceptors(DecryptTokenInterceptor)
  @Put('update-subscription/:id/:subscriptionID/:type')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update Subscription of the manager' })
  @ApiParam({
    name: 'type',
    required: true,
    description: '0: incase the user is updating or renwing the subscription, 1: incase the user is sending the proof of payment',
    enum: [0, 1]
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
  })
  @ApiBody({
    description: 'Upload image',
    type: UploadProofOfPaymentDto, // You need to define this DTO to describe the file upload
  })
  async updateSubscription(
    @Param('id') id: string,
    @Param('subscriptionID') subscriptionID: string,
    @Param('type') type: number,
    @Body() uploadProofOfPaymentDto: UploadProofOfPaymentDto,
  ) {
    return await this.managerService.updateSubscription(uploadProofOfPaymentDto, id, subscriptionID, type);
  }

  // Get Subscription Requests
  @UseInterceptors(DecryptTokenInterceptor)
  @Get('subscription-request/get')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get the list of subscription requests' })
  @ApiResponse({
    status: 200,
    description: 'Requests fetched successfully',
  })
  async getSubscriptionRequestss() {
    return await this.managerService.getSubscriptionRequests();
  }

  // Update status of Manager Subscriber Request
  @UseInterceptors(DecryptTokenInterceptor)
  @Put(':id/:status')   //  status 0: reject    1: approve
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update status manager subscription request' })
  @ApiResponse({
    status: 200,
    description: 'Request status updated successfully',
  })
  async updateManagerSubscriptionStatus(
    @Param('id') id: string,
    @Param('status') status: number,
  ) {
    return await this.managerService.updateManagerSubscriptionStatus(id, status);
  }

  // Update status of Manager
  @UseInterceptors(DecryptTokenInterceptor)
  @Post('status/:id/:status')   //  status 0: reject  1: approve
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update status manager' })
  @ApiResponse({
    status: 200,
    description: 'Request status updated successfully',
  })
  async updateManagerStatus(
    @Param('id') id: string,
    @Param('status') status: number,
  ) {
    return await this.managerService.updateManagerStatus(id, status);
  }
  
}

