import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/database/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_TOKEN!,
  },
  driver: "turso",
} satisfies Config;
