import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const ramos = mysqlTable("ramos", {
  idRamo: serial("idRamo").primaryKey(),
  ramo: varchar("ramo", { length: 60 }),
});
