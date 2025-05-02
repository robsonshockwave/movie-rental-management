import { ClientTypeorm } from '../entities/Client';
import { HireTypeorm } from '../entities/Hire';
import { MovieTypeorm } from '../entities/Movie';
import { typeormServer } from '../setup';
import { HireRepository } from './HireRepository';

describe('HireRepository', () => {
  const clientRepository = typeormServer.getRepository(ClientTypeorm);
  const movieRepository = typeormServer.getRepository(MovieTypeorm);
  const hireRepository = typeormServer.getRepository(HireTypeorm);
  const sut = new HireRepository();

  beforeEach(async () => {
    await hireRepository.delete({});
    await clientRepository.delete({});
    await movieRepository.delete({});
  });

  const clientDTO = {
    name: 'any_name',
    cpf: 'any_cpf',
    phone: 'any_phone',
    email: 'any_email',
    address: 'any_address',
  };

  const movieDTO = {
    name: 'any_name',
    author: 'any_author',
    genre: 'any_genre',
    ISAN: 'any_ISAN',
    quantity: 1,
  };

  test('should create a hire', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    const hire = await sut.create({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
      return_date: null,
    });

    expect(hire.requested_date).toEqual(new Date('2025-01-04').toISOString());
  });

  test('should return the return date saved in the database correctly', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    const hire = await hireRepository.save({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
      client: { id: client.id },
      movie: { id: movie.id },
    });

    const returned = await sut.returnMovie(
      hire.id,
      new Date('2025-01-03').toISOString()
    );

    expect(returned.delivery_date).toEqual(hire.delivery_date);
  });

  test('should update the return date in the database correctly', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    const hire = await hireRepository.save({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
      client: { id: client.id },
      movie: { id: movie.id },
    });

    const returned = await sut.returnMovie(
      hire.id,
      new Date('2025-01-03').toISOString()
    );

    expect(returned.return_date).toEqual(new Date('2025-01-03').toISOString());
  });

  test('should return peding hireds', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    await hireRepository.save({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
      client: { id: client.id },
      movie: { id: movie.id },
    });

    const pendingHires = await sut.getPendingHires();

    expect(pendingHires).toHaveLength(1);
    expect(pendingHires[0].client.name).toEqual(client.name);
    expect(pendingHires[0].client.cpf).toEqual(client.cpf);
    expect(pendingHires[0].movie.name).toEqual(movie.name);
  });

  test('should return hire with client and movie by id', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    const hire = await hireRepository.save({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
      client: { id: client.id },
      movie: { id: movie.id },
    });

    const returned = await sut.getHireWithClientAndMovieById(hire.id);

    expect(returned.client.cpf).toEqual(client.cpf);
    expect(returned.movie.name).toEqual(movie.name);
    expect(returned.id).toEqual(returned.id);
  });

  test('should is possible to return movie', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    const hire = await hireRepository.save({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
    });

    const returned = await sut.returnMovie(
      hire.id,
      new Date('2025-01-03').toISOString()
    );

    expect(returned.return_date).toEqual(new Date('2025-01-03').toISOString());
  });

  test('should return true if there is a pending rental by the user', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    await hireRepository.save({
      client_id: client.id,
      movie_id: movie.id,
      requested_date: new Date('2025-01-04').toISOString(),
      delivery_date: new Date('2025-01-01').toISOString(),
      client: { id: client.id },
      movie: { id: movie.id },
    });

    const returned = await sut.thisMovieHiredByClient(client.id, movie.id);

    expect(returned).toBe(true);
  });

  test('should return false if there is no pending rental by the user', async () => {
    const client = await clientRepository.save(clientDTO);
    const movie = await movieRepository.save(movieDTO);

    const returned = await sut.thisMovieHiredByClient(client.id, movie.id);

    expect(returned).toBe(false);
  });
});
