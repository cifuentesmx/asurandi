import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const formapago = mysqlTable("formapago", {
  idFormaPago: serial("idFormaPago").primaryKey(),
  formaPago: varchar("formaPago", { length: 20 }),
});
