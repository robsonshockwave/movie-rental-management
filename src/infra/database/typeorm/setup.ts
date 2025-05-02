import { DataSource } from 'typeorm';
import { ClientTypeorm } from './entities/Client.typeorm';

let typeormServer: DataSource;

typeormServer = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  dropSchema: true,
  entities: [ClientTypeorm],
});

export { typeormServer };
