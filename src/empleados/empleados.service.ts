import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../entities/empleado.entity';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async findAll(): Promise<Empleado[]> {
    return this.empleadoRepository.find();
  }

  async findOne(id: string): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({
      where: { phone_number: id },
    });
    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }
    return empleado;
  }

  async findByEmail(email: string): Promise<Empleado> {
    return this.empleadoRepository.findOne({ where: { email } });
  }

  async create(empleado: Empleado): Promise<Empleado> {
    const existingEmpleado = await this.findByEmail(empleado.email);
    if (existingEmpleado) {
      throw new ConflictException('Empleado ya existe');
    }

    const salt = await bcrypt.genSalt();
    empleado.password = await bcrypt.hash(empleado.password, salt);
    return this.empleadoRepository.save(empleado);
  }

  async update(id: string, empleado: Empleado): Promise<void> {
    const existingEmpleado = await this.findOne(id);
    if (!existingEmpleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const salt = await bcrypt.genSalt();
    if (empleado.password) {
      empleado.password = await bcrypt.hash(empleado.password, salt);
    }
    await this.empleadoRepository.update({ phone_number: id }, empleado);
  }

  async remove(id: string): Promise<void> {
    const existingEmpleado = await this.findOne(id);
    if (!existingEmpleado) {
      throw new NotFoundException('Empleado no encontrado');
    }
    await this.empleadoRepository.delete({ phone_number: id });
  }

  async recuperarPassword(email: string): Promise<void> {
    const empleado = await this.findByEmail(email);
    if (!empleado) {
      throw new NotFoundException('El email proporcionado no existe.');
    }
    const contrasenaTemporal = await this.generarContrasenaTemporal();
    const salt = await bcrypt.genSalt();
    empleado.password = await bcrypt.hash(contrasenaTemporal, salt);

    await this.empleadoRepository.save(empleado);

    await this.sendPasswordRecoveryEmail(empleado, contrasenaTemporal);
  }

  async sendPasswordRecoveryEmail(
    empleado: Empleado,
    pwd: string,
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

    const passwordRecoveryEmail = {
      from: 'info@deligrano.com',
      to: empleado.email,
      subject: 'Recuperación de tu contraseña',
      html: `
        <p>Hola ${empleado.first_name} ${empleado.last_name},</p>
        <br>
        <p>Recientemente solicitaste la recuperación de tu contraseña en la aplicacion de REGSAN.</p>
        <p>A continuación te proporcionamos tu nueva contraseña temporal:</p>
        <p style="font-size: 1.5em; font-weight: bold;">${pwd}</p>
        <br>
        <p>Te recomendamos que accedas a tu cuenta lo antes posible y cambies esta contraseña por una de tu elección.</p>
        <p>Si no has solicitado esta recuperación de contraseña, por favor contacta a nuestro equipo de soporte inmediatamente.</p>
        <br>
        <p>Gracias,</p>
        <br>
        <p>El equipo REGSAN</p>
      `,
    };

    await transporter.sendMail(passwordRecoveryEmail);
  }

  async generarContrasenaTemporal(length: number = 8): Promise<string> {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    return Array.from(
      { length },
      () => caracteres[Math.floor(Math.random() * caracteres.length)],
    ).join('');
  }
}
