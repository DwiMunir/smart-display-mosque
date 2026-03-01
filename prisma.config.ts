// DATABASE_URL is provided directly as an environment variable (Docker, Vercel, etc.)
// dotenv is only needed for local development via .env file — use dotenv-cli instead:
// e.g. dotenv -e .env -- npx prisma migrate dev
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'bun ./prisma/seed.ts'
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
