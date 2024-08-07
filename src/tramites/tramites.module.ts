// src/tramites/tramites.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramitesService } from './tramites.service';
import { TramitesController } from './tramites.controller';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';
import { DatosTecnicos } from '../entities/datos-tecnicos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tramite, Cliente, DatosTecnicos])],
  providers: [TramitesService],
  controllers: [TramitesController],
})
export class TramitesModule {}
