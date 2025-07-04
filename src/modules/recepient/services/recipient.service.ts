import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipientDocument, Recipient } from 'src/common/schema/recipient.schema';
import { CondominiumDocument, Condominium } from 'src/common/schema/condominium.schema';
import { UnitDocument, Unit } from 'src/common/schema/unit.schema';
import { BaseService } from 'src/services/base.service';
import { RecipientCreateDto, RecipientUpdateDto } from 'src/common/dtos/recipient.dto';
import * as fs from 'fs';
@Injectable()
export class RecipientService extends BaseService<
  Recipient,
  RecipientDocument
> {
  constructor(
    @InjectModel(Recipient.name)
    private readonly recipientModel: Model<RecipientDocument>,
    @InjectModel(Condominium.name)
    private readonly condominiumModel: Model<CondominiumDocument>,
    @InjectModel(Unit.name)
    private readonly unitModel: Model<UnitDocument>,
  ) {
    super(recipientModel);
  }

  async checkandVerifyCondominium(condominiumID) {
    return this.condominiumModel.find({ condominiumID: condominiumID })
  }
  async checkandVerifyUnit(unitID) {
    return this.condominiumModel.find({ unitId: unitID })
  }
  async updateUnitRecipientCount(unitID) {
    const count = await this.recipientModel.countDocuments({ unitID: unitID })
    const unit = await this.unitModel.findOneAndUpdate({ unitId: unitID }, { numberOfRecipients: count })
  }
  // Create a New Recipient
  async createRecipient(RecipientCreateDto: RecipientCreateDto) {
    const condominium = await this.checkandVerifyCondominium(RecipientCreateDto.condominiumID)
    if (!condominium) {
      // Error messages translations
      throw new BadRequestException('Condomínio não existe');
    }
    const unit = await this.checkandVerifyUnit(RecipientCreateDto.unitID)
    if (!unit) {
      throw new BadRequestException('Unidade não existe');
    }
    const checkRecipient = await this.recipientModel.findOne({
      unitID: RecipientCreateDto.unitID,
      name: RecipientCreateDto.name,
      email: RecipientCreateDto.email,
      whatsapp: RecipientCreateDto.whatsapp
    })
    if (checkRecipient) {
      throw new BadRequestException('Destinatário já existe');
    }
    const Recipient = await this.recipientModel.create({ ...RecipientCreateDto });
    await this.updateUnitRecipientCount(RecipientCreateDto.unitID)
    return Recipient;
  }
  //List all Recipients
  async listRecipients(condominiumID, unitID = "") {
    let condition = {}
    if (unitID && unitID != 'undefined') {
      condition = { unitID: unitID };
    } else {
      condition = { condominiumID: condominiumID };
    }
    const Recipients = await this.recipientModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: "units",
          localField: "unitID",
          foreignField: "unitId",
          as: "unit"
        }
      },
      {
        $sort: {
          "unit.0.address": -1 
        } 
      }
    ]).collation({ locale: "en", numericOrdering: true });
    return Recipients;
      


    // if(unitID){
    //   const Recipients = await this.recipientModel.find({ unitID: unitID });
    //   return Recipients;
    // }else{
    //   const Recipients = await this.recipientModel.find({ condominiumID: condominiumID });
    //   return Recipients;

    // }
  }
  //Update an Recipient
  async updateRecipient(id: string, RecipientUpdateDto: RecipientUpdateDto) {
    const condominium = await this.checkandVerifyCondominium(RecipientUpdateDto.condominiumID)
    if (!condominium) {
      throw new BadRequestException('Condominium does not exist')
    }
    const checkRecipient = await this.recipientModel.findOne({
      _id: { $ne: id },
      unitID: RecipientUpdateDto.unitID,
      name: RecipientUpdateDto.name,
      email: RecipientUpdateDto.email,
      whatsapp: RecipientUpdateDto.whatsapp
    })
    if (checkRecipient) {
      throw new BadRequestException('Recipient name already exists')
    }
    await this.recipientModel.findByIdAndUpdate(id, RecipientUpdateDto);
    const Recipient = await this.recipientModel.findById(id);
    return Recipient;
  }
  //Delete an Recipient
  async deleteRecipient(id: string) {
    const recipient = await this.recipientModel.findById(id);
    await this.recipientModel.findByIdAndDelete(id);
    await this.updateUnitRecipientCount(recipient.unitID)
    return { message: 'Recipient deleted successfully' };
  }

  async importRecipients(file, condominiumID) {
    if (file.mimetype !== 'text/csv') {
      // File handling error messages
      throw new BadRequestException('Tipo de arquivo inválido. Apenas arquivos CSV são aceitos.');
    }
    const filePath = `${process.cwd()}/recipients/${file.filename}`;
    // Check if the file exists before reading
    if (!filePath) {
      throw new BadRequestException('Arquivo não existe.');
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const rows = data.split('\n');
    const headers = rows[0].split(',');

    // Parse the data
    const result = [];

    // const unit = await this.unitModel.findOne({unitId: unitID})
    for (let i = 1; i < rows.length; i++) {
      // Skip empty rows
      if (rows[i].trim() === '') continue;

      const values = rows[i].split(',');
      const obj: any = {};

      // Create an object with header as keys and row values
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = values[j]?.trim() || '';
      }
      // obj.unitID = unitID
      obj.condominiumID = condominiumID
      result.push(obj);
    }

    for (const recipient of result) {
      if (recipient.notificationType) {
        await this.recipientModel.create(recipient);
        await this.updateUnitRecipientCount(recipient.unitID)
      }
    }

    return { message: 'Destinatários importados com sucesso' };
  }
}

