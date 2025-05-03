import { DataSource } from 'typeorm';
import { ClientTypeorm } from './entities/Client';
import { MovieTypeorm } from './entities/Movie';
import { HireTypeorm } from './entities/Hire';

let typeormServer: DataSource;

if (process.env.NODE_ENV === 'test') {
  typeormServer = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    dropSchema: true,
    entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
  });
} else if (process.env.NODE_ENV === 'integration') {
  typeormServer = new DataSource({
    type: 'postgres',
    host: 'localhost',
    database: 'locadora_test',
    synchronize: true,
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
  });
} else {
  typeormServer = new DataSource({
    type: 'postgres',
    host: 'localhost',
    database: 'locadora_prod',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
    migrations: ['src/infra/database/typeorm/migrations/*.js'],
  });
}

export { typeormServer };
