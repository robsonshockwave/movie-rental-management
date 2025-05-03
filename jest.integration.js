const jestConfig = require('./jest.config');

const config = {
  ...jestConfig,
  testMatch: ['<rootDir>/src/infra/http/routes/*.test.ts'],
};

module.exports = config;
