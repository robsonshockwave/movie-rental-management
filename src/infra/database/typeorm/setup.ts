import { DataSource } from 'typeorm';
import { ClientTypeorm } from './entities/Client';
import { MovieTypeorm } from './entities/Movie';
import { HireTypeorm } from './entities/Hire';

let typeormServer: DataSource;

typeormServer = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  dropSchema: true,
  entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
});

export { typeormServer };
