import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';
import { IUser } from '../../../../domain/entities/User';

@Entity('users')
export class UserTypeorm implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;
}
