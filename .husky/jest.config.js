/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'src/db/db.connect.ts',
    'src/app.ts',
    'src/config.ts',
    'src/routers/monster.router.ts',
    'src/routers/film.router.ts',
  ],
};
