import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const agentes = mysqlTable("agentes", {
  idAgente: serial("idAgente").primaryKey(),
  idUsuario: int("idUsuario"),
  clave: varchar("clave", { length: 15 }),
});
