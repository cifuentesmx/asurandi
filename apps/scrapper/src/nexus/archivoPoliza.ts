import { int, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const archivo = mysqlTable("archivo_poliza", {
  idArchivo: serial("idArchivo").primaryKey(),
  idPoliza: int("idPoliza"),
  archivo: text("archivo"),
});
