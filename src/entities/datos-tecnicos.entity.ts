import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tramite } from './tramite.entity';

@Entity('technical_data')
export class DatosTecnicos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  procedure_id: number;

  @ManyToOne(() => Tramite)
  @JoinColumn({ name: 'procedure_id' })
  tramite: Tramite;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  description: string;
}
