import { int, mysqlTable, serial } from "drizzle-orm/mysql-core";

export const nxConductos = mysqlTable("conductos", {
  idConducto: serial("idConducto").primaryKey(),
  idUsuario: int("idUsuario"),
});
