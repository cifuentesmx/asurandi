import { date, int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const bitacora = mysqlTable("estatuspolizabitacora", {
  idEdo: serial("idEdo").primaryKey(),
  idPoliza: int("idPoliza"),
  estatus: varchar("estatus", { length: 50 }),
  fechaValidacion: date("fechaValidacion"),
  motivo: varchar("motivo", { length: 50 }),
  idUsuario: int("idUsuario").default(0),
});
