import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const aseguradoras = mysqlTable("aseguradora", {
  idAseguradora: serial("idAseguradora").primaryKey(),
  aseguradora: varchar("aseguradora", { length: 60 }),
});
