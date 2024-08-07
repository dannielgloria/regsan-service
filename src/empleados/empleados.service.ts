import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../entities/empleado.entity';
import * as bcrypt from 'bcryptjs';

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
}
