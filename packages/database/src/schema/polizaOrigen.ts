import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblPolizaOrigen = pgTable('poliza_origen', {
    id: serial('id').primaryKey(),
    origen: varchar('origen', { length: 256 }).unique().notNull(),
});
