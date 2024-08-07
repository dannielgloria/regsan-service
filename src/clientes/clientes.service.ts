import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findByName(nombre: string): Promise<Cliente[]> {
    return this.clienteRepository.find({ where: { business_name: nombre } });
  }

  async findRFCAndBusinessName(): Promise<Partial<Cliente[]>> {
    return this.clienteRepository.find({
      select: ['rfc', 'business_name'],
    });
  }

  async findOne(rfc: string): Promise<Cliente> {
    return this.clienteRepository.findOne({ where: { rfc } });
  }

  async create(cliente: Cliente): Promise<Cliente> {
    return this.clienteRepository.save(cliente);
  }

  async update(rfc: string, cliente: Cliente): Promise<void> {
    await this.clienteRepository.update({ rfc }, cliente);
  }

  async remove(rfc: string): Promise<void> {
    await this.clienteRepository.delete({ rfc });
  }
}
