import { DataSource } from 'typeorm';

let typeormServer: DataSource | undefined;

typeormServer = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  dropSchema: true,
  entities: [],
});

export { typeormServer };
