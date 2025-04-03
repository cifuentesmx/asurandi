import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblModoPagos = pgTable('modo_pagos', {
    id: serial('id').primaryKey(),
    modoPago: varchar('modo_pago', { length: 256 }).notNull(),
});
