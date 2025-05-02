import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';
import { IMovie } from '../../../../domain/entities/Movie';

@Entity('movies')
export class MovieTypeorm implements IMovie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  genre: string;

  @Column()
  quantity: number;

  @Column()
  ISAN: string;

  @Column()
  author: string;
}
