import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblUsos = pgTable('usos', {
    id: serial('id').primaryKey(),
    uso: varchar('uso', { length: 256 }).notNull(),
});
