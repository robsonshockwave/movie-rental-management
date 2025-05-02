import { DataSource } from 'typeorm';
import { ClientTypeorm } from './entities/Client';
import { MovieTypeorm } from './entities/Movie';

let typeormServer: DataSource;

typeormServer = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  dropSchema: true,
  entities: [ClientTypeorm, MovieTypeorm],
});

export { typeormServer };
