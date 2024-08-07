import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';
import { DatosTecnicos } from '../entities/datos-tecnicos.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class TramitesService {
  constructor(
    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(DatosTecnicos)
    private readonly datosTecnicosRepository: Repository<DatosTecnicos>,
  ) {}

  async findAll(): Promise<Tramite[]> {
    return this.tramiteRepository.find({
      relations: ['client', 'datosTecnicos'],
    });
  }

  async findByClientBusinessName(businessName: string): Promise<Tramite[]> {
    const client = await this.clienteRepository.findOne({
      where: { business_name: businessName },
    });
    if (client) {
      return this.tramiteRepository.find({
        where: { client_rfc: client.rfc },
        relations: ['client', 'datosTecnicos'],
      });
    }
    return [];
  }

  async findByStatus(status: string): Promise<Tramite[]> {
    return this.tramiteRepository.find({
      where: { status },
      relations: ['client', 'datosTecnicos'],
    });
  }

  async findById(id: number): Promise<Tramite> {
    return this.tramiteRepository.findOne({
      where: { id },
      relations: ['client', 'datosTecnicos'],
    });
  }

  async create(tramite: Tramite): Promise<Tramite> {
    const newTramite = await this.tramiteRepository.save(tramite);
    await this.sendEmails(newTramite);
    return newTramite;
  }

  async update(id: number, tramite: Tramite): Promise<void> {
    await this.tramiteRepository.update(id, tramite);
  }

  async remove(id: number): Promise<void> {
    await this.tramiteRepository.delete(id);
  }

  private async sendEmails(tramite: Tramite) {
    const client = await this.clienteRepository.findOne({
      where: { rfc: tramite.client_rfc },
    });

    if (!client) return;

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
      subject: 'Nuevo Trámite Registrado',
      text: `Hola ${client.business_name},\n\nSe ha registrado un nuevo trámite con ID ${tramite.id}.\n\nInformación del trámite: ${JSON.stringify(tramite)}`,
    };

    // Email to Daniel Gloria
    const danielMailOptions = {
      from: 'your-email@gmail.com',
      to: 'danniel.gloria@gmail.com',
      subject: 'Nuevo Trámite Registrado',
      text: `Se ha registrado un nuevo trámite para el cliente ${client.business_name} con ID ${tramite.id}.`,
    };

    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(danielMailOptions);
  }
}
