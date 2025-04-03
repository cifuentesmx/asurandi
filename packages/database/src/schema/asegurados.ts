import { bigserial, index, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tblAsegurados = pgTable('asegurados', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    nombre: varchar('name', { length: 200 }).notNull(),
    email: varchar('email', { length: 200 }),
    rfc: varchar('rfc', { length: 20 }),
    nexusId: integer('nexus_id'),
    qualitasId: varchar('qualitas_id', { length: 20 }),
    anaId: varchar('ana_id', { length: 20 }),
    celular: varchar('celular', { length: 45 }),
    direccion: varchar('direccion', { length: 200 }),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
}, (tblAsegurado) => {
    return [
        index('asegurados_name_idx')
            .on(tblAsegurado.saasId, tblAsegurado.nombre),
        index('account_rfc_idx')
            .on(tblAsegurado.saasId, tblAsegurado.rfc), 
    ]
});
