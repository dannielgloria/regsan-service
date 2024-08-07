// src/datos-tecnicos/datos-tecnicos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosTecnicosService } from './datos-tecnicos.service';
import { DatosTecnicosController } from './datos-tecnicos.controller';
import { DatosTecnicos } from '../entities/datos-tecnicos.entity';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatosTecnicos, Tramite, Cliente])],
  providers: [DatosTecnicosService],
  controllers: [DatosTecnicosController],
})
export class DatosTecnicosModule {}
