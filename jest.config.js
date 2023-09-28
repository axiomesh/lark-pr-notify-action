/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true,
  setupFiles: ['./test/.env.js']
}

module.exports = config;