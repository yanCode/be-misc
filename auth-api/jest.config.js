/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  verbose: true,
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/src/utils/swagger.utils.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // clearMocks: truep
};
