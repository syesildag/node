import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  verbose: true,
  resolver: "ts-jest-resolver",
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  globals: {
    'ts-jest': {
      "tsconfig": "tsconfig.test.json"
    }
  }
};

export default config;