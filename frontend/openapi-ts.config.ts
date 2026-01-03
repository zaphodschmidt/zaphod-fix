import { defineConfig } from '@hey-api/openapi-ts';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: '../backend/schema.yaml',
  output: 'src/api/',
  plugins: [
    '@tanstack/react-query',
  ],
});