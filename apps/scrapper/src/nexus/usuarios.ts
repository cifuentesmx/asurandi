import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const nxUsuarios = mysqlTable("usuarios", {
  idUsuario: serial("idUsuario").primaryKey(),
  usuario: varchar("usuario", { length: 45 }).notNull(),
  password: varchar("password", { length: 45 }),
  borrado: int("borrado", { unsigned: true }),
  idEmpleado: int("idEmpleado", { unsigned: true }),
});
