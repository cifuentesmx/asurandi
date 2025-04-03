import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const entidad = mysqlTable("entidad", {
  id: serial("id").primaryKey(),
  opcion: varchar("opcion", { length: 45 }),
});
