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
} else {
  typeormServer = new DataSource({
    type: 'postgres',
    host: 'localhost',
    database: 'localdora_test',
    synchronize: true,
    dropSchema: true,
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
  });
}

export { typeormServer };
