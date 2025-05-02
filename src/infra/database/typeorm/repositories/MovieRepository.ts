import { Like, Repository } from 'typeorm';
import { IMovieRepository } from '../../../../domain/repositories/IMovieRepository';
import { MovieTypeorm } from '../entities/Movie';
import { typeormServer } from '../setup';
import { IMovie, Movie } from '../../../../domain/entities/Movie';

export class MovieRepository implements IMovieRepository {
  private ormRepository: Repository<MovieTypeorm>;

  constructor() {
    this.ormRepository = typeormServer.getRepository(MovieTypeorm);
  }

  async create(data: Movie): Promise<MovieTypeorm> {
    const movie = this.ormRepository.create(data);

    await this.ormRepository.save(movie);

    return movie;
  }

  async findByISAN(ISAN: string): Promise<MovieTypeorm | null> {
    const movie = await this.ormRepository.findOneBy({ ISAN });

    return movie;
  }

  async findByISANorName(value: string): Promise<MovieTypeorm[] | []> {
    const movies = await this.ormRepository.find({
      where: [{ ISAN: Like(`%${value}%`) }, { name: value }],
    });

    return movies;
  }
}
