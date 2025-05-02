import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';
import { IClient } from '../../../../domain/entities/Client';

@Entity('clients')
export class ClientTypeorm implements IClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;
}
