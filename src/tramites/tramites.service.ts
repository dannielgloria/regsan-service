import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tramite } from '../entities/tramite.entity';
import { Cliente } from '../entities/cliente.entity';
import * as nodemailer from 'nodemailer';
import { EmpleadosService } from 'src/empleados/empleados.service';

@Injectable()
export class TramitesService {
  constructor(
    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly empleadosService: EmpleadosService,
  ) {}

  async findAll(): Promise<Tramite[]> {
    return this.tramiteRepository.find({
      relations: ['client'],
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
        relations: ['client'],
      });
    }
  }

  async findByStatus(status: string): Promise<Tramite[]> {
    const client = await this.tramiteRepository.find({
      where: { status },
      relations: ['client'],
    });
    if (client.length === 0) {
      throw new NotFoundException('Estatus no encontrado');
    }
    return client;
  }

  async findById(id: string): Promise<Tramite> {
    const tramite = await this.tramiteRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (tramite === null) {
      throw new NotFoundException('Cliente no encontrado');
    } else {
      return tramite;
    }
  }

  async create(tramite: Tramite): Promise<Tramite> {
    if (!tramite.id || tramite.id.trim() === '') {
      tramite.id = uuidv4();
    }
    const existingTramite = await this.tramiteRepository.findOne({
      where: { id: tramite.id },
    });
    if (existingTramite) {
      throw new ConflictException('Trámite con ese ID ya existe');
    }
    const newTramite = await this.tramiteRepository.save(tramite);
    await this.sendEmails(newTramite);
    return newTramite;
  }

  async update(id: string, tramite: Tramite): Promise<void> {
    const existingTramite = await this.findById(id);
    if (!existingTramite) {
      throw new ConflictException('Tramite no existente');
    }
    await this.tramiteRepository.update(id, tramite);
  }

  async remove(id: string): Promise<void> {
    const existingTramite = await this.findById(id);
    if (!existingTramite) {
      throw new ConflictException('Tramite no existente');
    }
    await this.tramiteRepository.delete(id);
  }

  async updateTechnicalData(id: string, technicalData: string): Promise<void> {
    const existingTramite = await this.findById(id);
    if (!existingTramite) {
      throw new ConflictException('Tramite no existente');
    }

    existingTramite.technical_data = technicalData;
    await this.tramiteRepository.save(existingTramite);

    await this.sendTechnicalDataUpdateEmail(existingTramite);
  }

  async getTechnicalDataById(id: string): Promise<string> {
    const existingTramite = await this.findById(id);
    if (!existingTramite) {
      throw new NotFoundException('Tramite no existente');
    }

    return existingTramite.technical_data;
  }

  async updateSalesFlag(id: string): Promise<void> {
    const existingTramite = await this.findById(id);
    const empleadosFacturacion =
      await this.empleadosService.findFacturacionEmails();
    if (!existingTramite) {
      throw new NotFoundException('Trámite no existente');
    }

    existingTramite.sales_flag = true;

    await this.tramiteRepository.save(existingTramite);

    await this.sendInvoiceNotification(empleadosFacturacion, existingTramite);
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
            <td>${tramite.technical_data}</td>
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

  private async sendTechnicalDataUpdateEmail(tramite: Tramite) {
    const client = await this.clienteRepository.findOne({
      where: { rfc: tramite.client_rfc },
    });

    if (!client) return;

    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: 'info@deligrano.com',
        pass: '2133010323Gl?',
      },
    });

    const mailOptions = {
      from: 'info@deligrano.com',
      to: client.email,
      subject: 'Actualización de datos técnicos',
      html: `
        <p>Hola <strong>${client.contact_first_name} ${client.contact_last_name}</strong>,</p>
        <p>Se han actualizado los datos técnicos del trámite con ID ${tramite.id}.</p>
        <p>Datos técnicos nuevos: ${tramite.technical_data}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
  async sendInvoiceNotification(
    emails: string[],
    tramite: Tramite,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587, // o 465 para SSL
      secure: false, // true para puerto 465, false para otros puertos
      auth: {
        user: 'info@deligrano.com',
        pass: '2133010323Gl?',
      },
    });

    const mailOptions = {
      from: 'info@deligrano.com',
      to: emails,
      subject: 'Notificación de emisión de factura',
      html: `
        <p>Estimado equipo de Facturación,</p>
        <p>Se ha emitido una nueva factura correspondiente al trámite con ID: <strong>${tramite.id}</strong>, asociado al cliente <strong>${tramite.client.business_name}</strong>.</p>
        <p>Les solicitamos amablemente dar seguimiento a este trámite lo antes posible.</p>
        <p>Información del trámite:</p>
        <ul>
          <li><strong>ID del Trámite:</strong> ${tramite.id}</li>
          <li><strong>Cliente:</strong> ${tramite.client.business_name}</li>
          <li><strong>RFC del Cliente:</strong> ${tramite.client_rfc}</li>
          <li><strong>Fecha de Inicio:</strong> ${tramite.start_date}</li>
          <li><strong>Fecha de Término:</strong> ${tramite.end_date}</li>
          <li><strong>Estatus del Trámite:</strong> ${tramite.status}</li>
        </ul>
        <p>Gracias por su atención.</p>
        <br>
        <p>Atentamente,</p>
        <p>El equipo de REGSAN</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  }
}
