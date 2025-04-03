import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblRamos = pgTable('ramos', {
    id: serial('id').primaryKey(),
    ramo: varchar('ramo', { length: 40 }).notNull(),
});
