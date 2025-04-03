import {
  int,
  longtext,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

export const datosExtraPoliza = mysqlTable("datosExtraPoliza", {
  idDatos: serial("idDatos").primaryKey(),
  idPoliza: int("idPoliza"),
  unidad: varchar("unidad", { length: 50 }),
  origen: varchar("origen", { length: 50 }),
  valor: varchar("valor", { length: 50 }),
  uso: varchar("uso", { length: 50 }),
  cobertura: varchar("cobertura", { length: 50 }),
  audita: varchar("audita", { length: 50 }),
  motivo: longtext("motivo"),
  tipoEndoso: varchar("tipoEndoso", { length: 50 }),
  isMaestra: int('isMaestra').default(0)
});
