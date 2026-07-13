import { defineConfig } from "@prisma/config";

// SQLite файл prisma/dev.db — schema.prisma-гийн datasource-тай ижил байх ёстой.
// Production-д DATABASE_URL env-ээр солино (жишээ нь Postgres руу шилжихэд).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
});
