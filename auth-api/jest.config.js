/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // clearMocks: true
};
