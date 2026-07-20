const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
  ...createCjsPreset({
    tsconfig: '<rootDir>/tsconfig.spec.json',
  }),
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/app/**/*.ts',
    '!<rootDir>/src/app/**/*.spec.ts',
  ],
};
