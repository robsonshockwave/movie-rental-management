import { typeormServer } from './setup';

beforeAll(async () => {
  await typeormServer?.initialize();
});

afterAll(async () => {
  await typeormServer?.destroy();
});
