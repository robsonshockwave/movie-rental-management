import { IsNull, Repository } from 'typeorm';
import { IHireRepository } from '../../../../domain/repositories/IHireRepository';
import { HireTypeorm } from '../entities/Hire';
import { typeormServer } from '../setup';
import { Hire } from '../../../../domain/entities/Hire';

export class HireRepository implements IHireRepository {
  private ormRepository: Repository<HireTypeorm>;

  constructor() {
    this.ormRepository = typeormServer.getRepository(HireTypeorm);
  }

  async create(data: Hire): Promise<HireTypeorm> {
    return this.ormRepository.save({
      ...data,
      client: { id: data.client_id },
      movie: { id: data.movie_id },
    });
  }

  async thisMovieHiredByClient(
    client_id: string,
    movie_id: string
  ): Promise<boolean> {
    const existingHire = await this.ormRepository.count({
      where: {
        client: {
          id: client_id,
        },
        movie: {
          id: movie_id,
        },
        return_date: IsNull(),
      },
    });

    return existingHire > 0;
  }

  async getPendingHires(): Promise<HireTypeorm[]> {
    const hires = await this.ormRepository.find({
      where: { return_date: IsNull() },
      relations: {
        client: true,
        movie: true,
      },
      select: {
        id: true,
        requested_date: true,
        delivery_date: true,
        return_date: true,
        client: { cpf: true, name: true, email: true },
        movie: { name: true },
      },
    });

    return hires;
  }

  async getHireWithClientAndMovieById(id: string): Promise<HireTypeorm> {
    const hire = await this.ormRepository.findOne({
      where: { id },
      relations: {
        client: true,
        movie: true,
      },
      select: {
        id: true,
        requested_date: true,
        delivery_date: true,
        return_date: true,
        client: { cpf: true, name: true, email: true },
        movie: { name: true },
      },
    });

    return hire!;
  }

  async returnMovie(
    hire_id: string,
    return_date: string
  ): Promise<HireTypeorm> {
    await this.ormRepository.update(hire_id, { return_date });

    const hire = await this.ormRepository.findOneBy({ id: hire_id });

    return hire!;
  }
}
