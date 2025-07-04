import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionPackageDocument, SubscriptionPackage } from 'src/common/schema/subscriptionPackage.schema';
import { BaseService } from 'src/services/base.service';
import { SubscriptionPackageCreateDto, SubscriptionPackageUpdateDto } from 'src/common/dtos/subscriptionPackage.dto';

@Injectable()
export class SubscriptionPackageService extends BaseService<
  SubscriptionPackage,     
  SubscriptionPackageDocument
> {
  constructor(
    @InjectModel(SubscriptionPackage.name)
    private readonly subscriptionPackageModel: Model<SubscriptionPackageDocument>,
  ) {
    super(subscriptionPackageModel);
  }

  ////////////////////// Admin Routes //////////////////////
  // Create a New SubscriptionPackage
  async createSubscriptionPackage(subscriptionPackageCreateDto: SubscriptionPackageCreateDto) {
    const checkSubscriptionPackage = await this.subscriptionPackageModel.findOne({ name: subscriptionPackageCreateDto.name})
    if(checkSubscriptionPackage){
      // Error messages translations
      throw new BadRequestException('Nome do pacote de assinatura já existe');
    }
    const subscriptionPackage = await this.subscriptionPackageModel.create({ ...subscriptionPackageCreateDto });
    return subscriptionPackage;
  }
  //List all SubscriptionPackages
  async listSubscriptionPackages() {
    const subscriptionPackages = await this.subscriptionPackageModel.find();
    return subscriptionPackages;
  }
  //Update an SubscriptionPackage
  async updateSubscriptionPackage(id: string, subscriptionPackageUpdateDto: SubscriptionPackageUpdateDto) {
    const checkSubscriptionPackage = await this.subscriptionPackageModel.findOne({ _id: { $ne: id }, name: subscriptionPackageUpdateDto.name})
    if(checkSubscriptionPackage){
      throw new BadRequestException('Nome do pacote de assinatura já existe');
    }
    await this.subscriptionPackageModel.findByIdAndUpdate(id, subscriptionPackageUpdateDto);
    const subscriptionPackage = await this.subscriptionPackageModel.findById(id);
    return subscriptionPackage;
  }
  //Delete an SubscriptionPackage
  async deleteSubscriptionPackage(id: string) {
    await this.subscriptionPackageModel.findByIdAndDelete(id);
    // Success message translation
    return { message: 'Pacote de assinatura excluído com sucesso' };
  }


}

