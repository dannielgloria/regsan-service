import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosTecnicos } from '../entities/datos-tecnicos.entity';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class DatosTecnicosService {
  constructor(
    @InjectRepository(DatosTecnicos)
    private readonly datosTecnicosRepository: Repository<DatosTecnicos>,
    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<DatosTecnicos[]> {
    return this.datosTecnicosRepository.find({ relations: ['tramite'] });
  }

  async findByTramiteId(tramiteId: number): Promise<DatosTecnicos[]> {
    return this.datosTecnicosRepository.find({
      where: { procedure_id: tramiteId },
      relations: ['tramite'],
    });
  }

  async create(datosTecnicos: DatosTecnicos): Promise<DatosTecnicos> {
    const newDatosTecnicos =
      await this.datosTecnicosRepository.save(datosTecnicos);
    await this.sendEmail(newDatosTecnicos);
    return newDatosTecnicos;
  }

  async update(id: number, datosTecnicos: DatosTecnicos): Promise<void> {
    await this.datosTecnicosRepository.update(id, datosTecnicos);
  }

  async remove(id: number): Promise<void> {
    await this.datosTecnicosRepository.delete(id);
  }

  private async sendEmail(datosTecnicos: DatosTecnicos) {
    const tramite = await this.tramiteRepository.findOne({
      where: { id: datosTecnicos.procedure_id },
      relations: ['client'],
    });
    const client = tramite.client;

    const previousDatosTecnicos = await this.datosTecnicosRepository.find({
      where: { procedure_id: tramite.id },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    // Email to the client
    const clientMailOptions = {
      from: 'your-email@gmail.com',
      to: client.email,
      subject: 'Nuevo Dato Técnico Registrado',
      text: `Hola ${client.business_name},\n\nSe ha registrado un nuevo dato técnico para el trámite con ID ${tramite.id}.\n\nInformación del nuevo dato técnico: ${JSON.stringify(datosTecnicos)}\n\nDatos técnicos anteriores:\n${previousDatosTecnicos.map((dt) => JSON.stringify(dt)).join('\n')}`,
    };

    await transporter.sendMail(clientMailOptions);
  }
}
