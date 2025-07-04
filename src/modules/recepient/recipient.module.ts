import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipientService } from './services/recipient.service';
import { RecipientController } from './controllers/recipient.controller';
import { Recipient, RecipientSchema } from 'src/common/schema/recipient.schema';
import { Condominium, CondominiumSchema } from 'src/common/schema/condominium.schema';
import { Unit, UnitSchema } from 'src/common/schema/unit.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Recipient.name, schema: RecipientSchema},
        {name: Unit.name, schema: UnitSchema},
        {name: Condominium.name, schema: CondominiumSchema}
    ]),
  ],
  controllers: [RecipientController],
  providers: [RecipientService],
  exports: [MongooseModule]
})
export class RecipientModule {}
