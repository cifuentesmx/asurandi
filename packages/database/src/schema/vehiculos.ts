import { tblTipoVehiculos } from './tipoVehiculos.js';
import { pgTable, varchar, integer, bigserial, uniqueIndex, timestamp } from 'drizzle-orm/pg-core';

export const tblVehiculos = pgTable('vehiculos', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }).notNull(),
    nombre: varchar('nombre', { length: 256 }).notNull(),
    descripcion: varchar('descripcion', { length: 200 }),
    serie: varchar('serie', { length: 40 }).notNull(),
    motor: varchar('motor', { length: 40 }),
    placas: varchar('placas', { length: 25 }),
    tipovehiculoId: integer('tipovehicuo_id').references(() => tblTipoVehiculos.id),
    carroceria: varchar('carroceria', { length: 40 }),
    color: varchar('color', { length: 40 }),
    ocupantes: integer('ocupantes'),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
},
    (tbl) => [
        uniqueIndex('vehiculo_serie_account_idx')
            .on(tbl.saasId, tbl.serie),
    ]

);
