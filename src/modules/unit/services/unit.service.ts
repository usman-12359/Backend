import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnitDocument, Unit } from 'src/common/schema/unit.schema';
import { CondominiumDocument, Condominium } from 'src/common/schema/condominium.schema';
import { RecipientDocument, Recipient } from 'src/common/schema/recipient.schema';
import { BaseService } from 'src/services/base.service';
import { UnitCreateDto, UnitUpdateDto } from 'src/common/dtos/unit.dto';
import * as fs from 'fs';
import { NOTIFICATION_TYPES } from 'src/common/constants/ENUM';

@Injectable()
export class UnitService extends BaseService<
  Unit,
  UnitDocument
> {
  constructor(
    @InjectModel(Unit.name)
    private readonly unitModel: Model<UnitDocument>,
    @InjectModel(Condominium.name)
    private readonly condominiumModel: Model<CondominiumDocument>,
    @InjectModel(Recipient.name)
    private readonly recipientModel: Model<RecipientDocument>,
  ) {
    super(unitModel);
  }

  async checkandVerifyCondominium(condominiumID) {
    return this.condominiumModel.find({ condominiumID: condominiumID })
  }
  async updateCondomimiumUnitCount(condominiumID) {
    const count = await this.unitModel.countDocuments({ condominiumID: condominiumID })
    await this.condominiumModel.findOneAndUpdate({ condominiumID: condominiumID }, { numberOfRegisteredUnits: count })
  }
  // Create a New Unit
  async createUnit(UnitCreateDto: UnitCreateDto) {
    const condominium = await this.checkandVerifyCondominium(UnitCreateDto.condominiumID)
    if (!condominium) {
      throw new BadRequestException('Condomínio não existe');
    }
    const checkUnit = await this.unitModel.findOne({ condominiumID: UnitCreateDto.condominiumID, address: UnitCreateDto.address })
    if (checkUnit) {
      throw new BadRequestException('Unidade já existe');
    }
    const Unit = await this.unitModel.create({ ...UnitCreateDto });
    await this.updateCondomimiumUnitCount(UnitCreateDto.condominiumID)
    return Unit;
  }
  //List all Units
  async listUnits(condominiumID) {
    const Units = await this.unitModel.find({ condominiumID: condominiumID }).collation({ locale: "en", numericOrdering: true })
    .sort({ address: -1 });
    return Units;
  }
  //Update an Unit
  async updateUnit(id: string, UnitUpdateDto: UnitUpdateDto) {
    const condominium = await this.checkandVerifyCondominium(UnitUpdateDto.condominiumID)
    if (!condominium) {
      throw new BadRequestException('Condomínio não existe');
    }
    const checkUnit = await this.unitModel.findOne({ _id: { $ne: id }, address: UnitUpdateDto.address, condominiumID: UnitUpdateDto.condominiumID })
    if (checkUnit) {
      throw new BadRequestException('Nome da unidade já existe');
    }
    await this.unitModel.findByIdAndUpdate(id, UnitUpdateDto);
    const Unit = await this.unitModel.findById(id);
    return Unit;
  }
  //Delete an Unit
  async deleteUnit(id: string) {
    const unit = await this.unitModel.findById(id);
    const recipient = await this.recipientModel.findOne({ unitID: unit.unitId })
    if (recipient) {
      throw new BadRequestException('Não é possível excluir esta unidade. Existem destinatários vinculados a ela.');
    }
    await this.unitModel.findByIdAndDelete(id);
    await this.updateCondomimiumUnitCount(unit.condominiumID)
    return { message: 'Unidade excluída com sucesso' };
  }
  async createRecipient(data, condominiumID, unitID) {
    let notificationType = NOTIFICATION_TYPES.NO_NOTIFICATION
    switch (data.notificationType) {
      case 1:
        notificationType = NOTIFICATION_TYPES.WHATSAPP
        break;
      case '1':
        notificationType = NOTIFICATION_TYPES.WHATSAPP
        break;
      case 2:
        notificationType = NOTIFICATION_TYPES.EMAIL
        break;
      case '2':
        notificationType = NOTIFICATION_TYPES.EMAIL
        break;
      case 3:
        notificationType = NOTIFICATION_TYPES.BOTH
        break;
      case '3':
        notificationType = NOTIFICATION_TYPES.BOTH
        break;
      default:
        notificationType = NOTIFICATION_TYPES.NO_NOTIFICATION
        break;
    }
    try {
      await this.recipientModel.create({
        condominiumID: condominiumID,
        unitID: unitID,
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        notificationType: notificationType
      });
      return true
    } catch (e) {
      return false
    }
  }
  async updateUnitRecipientCount(unitID) {
    const count = await this.recipientModel.countDocuments({ unitID: unitID })
    const unit = await this.unitModel.findOneAndUpdate({ unitId: unitID }, { numberOfRecipients: count })
  }
  mapHeader = (title) => {
    switch (title) {
      case 'Complemento do endereco':
        return 'address'
      case 'nome':
        return 'name'
      case 'Nome':
        return 'name'
      case 'email':
        return 'email'
      case 'Email':
        return 'email'
      case 'celular':
        return 'whatsapp'
      case 'Celular':
        return 'whatsapp'
      case 'forma de notificacao (1 - SMS: 2 - e-mail: 3 - ambos )':
        return 'notificationType'
      case 'Forma de Notificacao (1 - SMS / 2 - E-mail / 3 - Ambas / 4 - Nenhuma)':
        return 'notificationType'
      default:
        return title
    }
  }
  async importUnits(file, condominiumID) {
    try {

      if (file.mimetype !== 'text/csv') {
        throw new BadRequestException('Tipo de arquivo inválido. Apenas arquivos CSV são aceitos.');
      }
      const filePath = `${process.cwd()}/units/${file.filename}`;
      // Check if the file exists before reading
      if (!filePath) {
        throw new BadRequestException('Arquivo não existe.');
      }
      const data = fs.readFileSync(filePath, 'utf8');
      const rows = data.split('\n');
      const headers = rows[0].split(',');

      // Parse the data
      const result = [];

      for (let i = 1; i < rows.length; i++) {
        // Skip empty rows
        if (rows[i].trim() === '') continue;

        const values = rows[i].split(',');
        const obj: any = {};

        // Create an object with header as keys and row values
        for (let j = 0; j < headers.length; j++) {
          obj[this.mapHeader(headers[j].trim())] = values[j]?.trim() || '';
        }
        obj.condominiumID = condominiumID
        result.push(obj);
      }


      for (const unit of result) {
      // check if the unit address already exists
      let unit_ = await this.unitModel.findOne({ address: unit.address, condominiumID: condominiumID })
      if (!unit_) {
        unit_ = await this.unitModel.create({ address: unit.address, condominiumID: condominiumID });
      }
      await this.createRecipient(unit, condominiumID, unit_.unitId)
      await this.updateUnitRecipientCount(unit_.unitId)
      }
      await this.updateCondomimiumUnitCount(condominiumID)

      return { message: 'Unidades importadas com sucesso', result };

    } catch (error) {
      return { message: 'Falha na importação. Por favor, verifique o formato e certifique-se de que as chaves estão corretas' };
    }
  }

}

