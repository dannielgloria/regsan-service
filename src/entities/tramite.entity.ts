import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { DatosTecnicos } from './datos-tecnicos.entity';

@Entity('procedures')
export class Tramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 13 })
  client_rfc: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'client_rfc' })
  client: Cliente;

  @Column({ type: 'varchar', length: 100 })
  distinctive_denomination: string;

  @Column({ type: 'varchar', length: 100 })
  generic_name: string;

  @Column({ type: 'varchar', length: 100 })
  product_manufacturer: string;

  @Column({ type: 'varchar', length: 100 })
  service_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  input_value: number;

  @Column({ type: 'varchar', length: 100 })
  type_description: string;

  @Column({ type: 'varchar', length: 100 })
  class_name: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 100 })
  process_description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  completion_percentage: number;

  @Column({ type: 'date' })
  cofepris_entry_date: Date;

  @Column({ type: 'varchar', length: 50 })
  cofepris_status: string;

  @Column({ type: 'varchar', length: 50 })
  cofepris_entry_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cofepris_link: string;

  @Column({ type: 'varchar', length: 50 })
  assigned_consultant: string;

  @Column({ type: 'text', nullable: true })
  additional_information: string;

  @OneToMany(() => DatosTecnicos, (datosTecnicos) => datosTecnicos.tramite)
  datosTecnicos: DatosTecnicos[];
}
