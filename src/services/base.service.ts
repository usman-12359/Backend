import { NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Base, BaseDocument } from 'src/common/schema/abstract.schema';

export abstract class BaseService<
  Entity extends Base,
  Document extends BaseDocument,
> {
  constructor(private readonly model: Model<Document>) {}

  async create(body): Promise<Document> {
    return await this.model.create(body);
  }

  getEntityName() {
    return `${this.model.modelName.replace('Entity', '')}`;
  }

  async findOne(criteria: FilterQuery<Entity>): Promise<Document | null> {
    return await this.model.findOne({ ...criteria, isDeleted: false });
  }

  async findOneOrCreate(
    criteria: object,
    payload: UpdateQuery<Document>,
  ): Promise<Document> {
    return await this.model.findOneAndUpdate(
      { ...criteria },
      { ...payload },
      { new: true, upsert: true, returnOriginal: false },
    );
  }

  async findByIdOrThrowException(_id: string): Promise<Document> {
    const eitherEntityOrNull = await this.findOne({ _id, isDeleted: false });
    if (!eitherEntityOrNull)
      throw new NotFoundException(`${this.getEntityName()} not found`);
    return eitherEntityOrNull;
  }

  async find(criteria: FilterQuery<Entity>): Promise<Document[] | []> {
    return await this.model.find({ ...criteria, isDeleted: false }).exec();
  }

  async delete(_id: string) {
    await this.findByIdOrThrowException(_id);
    await this.model.updateOne({ _id }, { isDeleted: true });
    return {
      message: `${this.getEntityName()} deleted successfully`,
    };
  }

  async update(_id: string, payload: UpdateQuery<Document>): Promise<Document> {
    await this.findByIdOrThrowException(_id);
    return await this.model.findByIdAndUpdate(_id, { ...payload });
  }
}
