import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblTipoVehiculos = pgTable('tipo_vehiculos', {
    id: serial('id').primaryKey(),
    tipovehiculo: varchar('tipovehiculo', { length: 40 }).notNull(),
});
