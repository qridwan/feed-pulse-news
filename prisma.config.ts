import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Use DIRECT_URL for migrations (avoids pooler port 6543 hanging). App runtime can use DATABASE_URL (pooler).
const databaseUrl =
  process.env.DIRECT_URL || process.env.DATABASE_URL || env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
