import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (client === null) {
      throw new NotFoundException('Cliente no encontrado');
    } else {
      return this.tramiteRepository.find({
        where: { client_rfc: client.rfc },
        relations: ['client', 'datosTecnicos'],
      });
    }
  }

  async findByStatus(status: string): Promise<Tramite[]> {
    const client = await this.tramiteRepository.find({
      where: { status },
      relations: ['client', 'datosTecnicos'],
    });
    if (client.length === 0) {
      throw new NotFoundException('Estatus no encontrado');
    }
    return client;
  }

  async findById(id: number): Promise<Tramite> {
    const tramite = await this.tramiteRepository.findOne({
      where: { id },
      relations: ['client', 'datosTecnicos'],
    });
    if (tramite === null) {
      throw new NotFoundException('Cliente no encontrado');
    } else {
      return tramite;
    }
  }

  async create(tramite: Tramite): Promise<Tramite> {
    const newTramite = await this.tramiteRepository.save(tramite);
    await this.sendEmails(newTramite);
    return newTramite;
  }

  async update(id: number, tramite: Tramite): Promise<void> {
    const existingTramite = await this.findById(id);
    if (!existingTramite) {
      throw new ConflictException('Tramite no existente');
    }
    await this.tramiteRepository.update(id, tramite);
  }

  async remove(id: number): Promise<void> {
    const existingTramite = await this.findById(id);
    if (!existingTramite) {
      throw new ConflictException('Tramite no existente');
    }
    await this.tramiteRepository.delete(id);
  }

  private async sendEmails(tramite: Tramite) {
    const client = await this.clienteRepository.findOne({
      where: { rfc: tramite.client_rfc },
    });

    if (!client) return;

    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587, // o 465 para SSL
      secure: false, // true para puerto 465, false para otros puertos
      auth: {
        user: 'info@deligrano.com',
        pass: '2133010323Gl?',
      },
    });

    // Email to the client
    const clientMailOptions = {
      from: 'info@deligrano.com',
      to: client.email,
      subject: 'Nuevo Trámite Registrado',
      html: `
        <p>Hola ${client.contact_first_name} ${client.contact_last_name},</p>
        <p>Se ha registrado un nuevo trámite con ID ${tramite.id}.</p>
        <p>Información del trámite:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <td><strong>RFC</strong></td>
            <td>${tramite.client_rfc}</td>
          </tr>
          <tr>
            <td><strong>Denominación distintiva</strong></td>
            <td>${tramite.distinctive_denomination}</td>
          </tr>
          <tr>
            <td><strong>Nombre Genérico</strong></td>
            <td>${tramite.generic_name}</td>
          </tr>
          <tr>
            <td><strong>Fabricante</strong></td>
            <td>${tramite.product_manufacturer}</td>
          </tr>
          <tr>
            <td><strong>Nombre del Servicio</strong></td>
            <td>${tramite.service_name}</td>
          </tr>
          <tr>
            <td><strong>Insumo</strong></td>
            <td>${tramite.input_value}</td>
          </tr>
          <tr>
            <td><strong>Tipo</strong></td>
            <td>${tramite.type_description}</td>
          </tr>
          <tr>
            <td><strong>Clase</strong></td>
            <td>${tramite.class_name}</td>
          </tr>
          <tr>
            <td><strong>Fecha de Inicio</strong></td>
            <td>${tramite.start_date}</td>
          </tr>
          <tr>
            <td><strong>Fecha de Fin</strong></td>
            <td>${tramite.end_date}</td>
          </tr>
          <tr>
            <td><strong>Estatus</strong></td>
            <td>${tramite.status}</td>
          </tr>
          <tr>
            <td><strong>Proceso del trámite</strong></td>
            <td>${tramite.process_description}</td>
          </tr>
          <tr>
            <td><strong>Porcentaje de avance</strong></td>
            <td>${tramite.completion_percentage}</td>
          </tr>
          <tr>
            <td><strong>Fecha de Ingreso a COFEPRIS</strong></td>
            <td>${tramite.cofepris_entry_date}</td>
          </tr>
          <tr>
            <td><strong>Estatus de COFEPRIS</strong></td>
            <td>${tramite.cofepris_status}</td>
          </tr>
          <tr>
            <td><strong>Número de Entrada a COFEPRIS</strong></td>
            <td><a href="${tramite.cofepris_link}">${tramite.cofepris_entry_number}</a></td>
          </tr>
          <tr>
            <td><strong>Consultor Asignado</strong></td>
            <td>${tramite.assigned_consultant}</td>
          </tr>
          <tr>
            <td><strong>Información Adicional</strong></td>
            <td>${tramite.additional_information}</td>
          </tr>
        </table>
      `,
    };

    // Email to Daniel Gloria
    const danielMailOptions = {
      from: 'info@deligrano.com',
      to: 'danniel.gloria@gmail.com',
      subject: 'Nuevo Trámite Registrado',
      text: `Se ha registrado un nuevo trámite para el cliente ${client.business_name} con ID de tramite ${tramite.id}.`,
    };

    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(danielMailOptions);
  }
}
