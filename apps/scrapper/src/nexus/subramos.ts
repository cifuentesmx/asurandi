import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const subramos = mysqlTable("subramos", {
  idSubramo: serial("idSubramo").primaryKey(),
  subramo: varchar("subramo", { length: 60 }),
  idRamo: int("idRamo"),
});
