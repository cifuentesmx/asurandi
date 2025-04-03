import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const municipios = mysqlTable("municipios", {
  id: serial("id").primaryKey(),
  relacion: int("relacion"),
  opcion: varchar("opcion", { length: 45 }),
});
