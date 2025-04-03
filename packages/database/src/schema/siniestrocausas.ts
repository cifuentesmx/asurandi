import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblSiniestroCausas = pgTable('siniestros_causa', {
    id: serial('id').primaryKey(),
    causa: varchar('causa', { length: 40 }).notNull(),
});
