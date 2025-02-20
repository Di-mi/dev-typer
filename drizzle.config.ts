import { defineConfig } from 'drizzle-kit';
import './envConfig.ts';



export default defineConfig({
  out: 'app/server/db/drizzle',
  schema: 'app/server/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
