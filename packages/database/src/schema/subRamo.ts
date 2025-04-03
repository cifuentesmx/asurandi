import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblSubRamos = pgTable('subramos', {
    id: serial('id').primaryKey(),
    subramo: varchar('subramo', { length: 40 }).notNull(),
});
