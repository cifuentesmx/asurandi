import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const nxEmpleados = mysqlTable("empleado", {
  idEmpleado: serial("id_empleado").primaryKey(),
  nombre: varchar("nombre", { length: 15 }),
  tel: varchar('tel', { length: 15 }),
  cel: varchar('cel', { length: 15 }),
  email: varchar('email', { length: 50 }),

});
