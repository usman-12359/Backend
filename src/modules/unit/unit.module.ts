import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitService } from './services/unit.service';
import { UnitController } from './controllers/unit.controller';
import { Unit, UnitSchema } from 'src/common/schema/unit.schema';
import { Recipient, RecipientSchema } from 'src/common/schema/recipient.schema';
import { Condominium, CondominiumSchema } from 'src/common/schema/condominium.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Unit.name, schema: UnitSchema},
        {name: Condominium.name, schema: CondominiumSchema},
        {name: Recipient.name, schema: RecipientSchema}
    ]),
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [MongooseModule]
})
export class UnitModule {}
