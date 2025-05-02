import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import 'reflect-metadata';
import { IHire } from '../../../../domain/entities/Hire';
import { ClientTypeorm } from './Client';
import { MovieTypeorm } from './Movie';

@Entity('hires')
export class HireTypeorm implements IHire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requested_date: string;

  @Column()
  delivery_date: string;

  @Column({ nullable: true })
  return_date: string | null;

  @ManyToOne(() => ClientTypeorm)
  @JoinColumn({ name: 'client_id' })
  client: ClientTypeorm;

  @RelationId((hire: HireTypeorm) => hire.client)
  client_id: string;

  @ManyToOne(() => MovieTypeorm)
  @JoinColumn({ name: 'movie_id' })
  movie: MovieTypeorm;

  @RelationId((hire: HireTypeorm) => hire.movie)
  movie_id: string;
}
