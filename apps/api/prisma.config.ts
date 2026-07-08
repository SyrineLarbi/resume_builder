import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Prisma 7 no longer auto-loads .env — load it before reading any env vars.
loadEnv();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // CLI commands (migrate/db) use the DIRECT (unpooled) Neon endpoint.
  // The app's runtime client uses the pooled DATABASE_URL via the pg adapter.
  datasource: {
    url: env('DIRECT_URL'),
  },
  migrations: {
    // tsx resolves the generated client's explicit ".js" import specifiers to its ".ts" sources.
    seed: 'tsx prisma/seed.ts',
  },
});
