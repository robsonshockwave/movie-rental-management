import 'dotenv/config';
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
    synchronize: true,
    host: process.env.POSTGRES_HOST_TEST,
    database: process.env.POSTGRES_DATABASE_TEST,
    port: Number(process.env.POSTGRES_PORT_TEST),
    username: process.env.POSTGRES_USER_TEST,
    password: process.env.POSTGRES_PASS_TEST,
    entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
  });
} else {
  typeormServer = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST_PROD,
    database: process.env.POSTGRES_DATABASE_PROD,
    port: Number(process.env.POSTGRES_PORT_PROD),
    username: process.env.POSTGRES_USER_PROD,
    password: process.env.POSTGRES_PASS_PROD,
    entities: [ClientTypeorm, MovieTypeorm, HireTypeorm],
    migrations: ['src/infra/database/typeorm/migrations/*.ts'],
  });
}

export default typeormServer;
