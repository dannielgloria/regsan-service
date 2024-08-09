import { Injectable, NotFoundException } from '@nestjs/common';
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
    const datosTecnicos = await this.datosTecnicosRepository.find({
      where: { procedure_id: tramiteId },
      relations: ['tramite'],
    });
    if (datosTecnicos.length === 0) {
      throw new NotFoundException('Datos tecnicos no encontrados');
    }
    return datosTecnicos;
  }

  async create(datosTecnicos: DatosTecnicos): Promise<DatosTecnicos> {
    const newDatosTecnicos =
      await this.datosTecnicosRepository.save(datosTecnicos);
    await this.sendEmail(newDatosTecnicos);
    return newDatosTecnicos;
  }

  async update(id: number, datosTecnicos: DatosTecnicos): Promise<void> {
    const existingTecnicalData = await this.datosTecnicosRepository.findOne({
      where: { id },
    });
    if (existingTecnicalData === null) {
      throw new NotFoundException('Datos tecnicos no existentes');
    } else {
      await this.datosTecnicosRepository.update(id, datosTecnicos);
    }
  }

  async remove(id: number): Promise<void> {
    const existingTecnicalData = await this.datosTecnicosRepository.findOne({
      where: { id },
    });
    if (existingTecnicalData === null) {
      throw new NotFoundException('Datos tecnicos no existentes');
    } else {
      await this.datosTecnicosRepository.delete(id);
    }
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
      host: 'smtp.hostinger.com',
      port: 587, // o 465 para SSL
      secure: false, // true para puerto 465, false para otros puertos
      auth: {
        user: 'info@deligrano.com',
        pass: '2133010323Gl?',
      },
    });
    console.log(datosTecnicos);
    // Email to the client
    const clientMailOptions = {
      from: 'info@deligrano.com',
      to: client.email,
      subject: 'Nuevo Dato Técnico Registrado',
      text: `Hola ${client.business_name},\n\nSe ha registrado un nuevo dato técnico para el trámite con ID ${tramite.id}.\n\nInformación del nuevo dato técnico: ${JSON.stringify(datosTecnicos)}\n\nDatos técnicos anteriores:\n${previousDatosTecnicos.map((dt) => JSON.stringify(dt)).join('\n')}`,
    };

    await transporter.sendMail(clientMailOptions);
  }
}
