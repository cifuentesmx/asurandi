import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const tblServicios = pgTable('servicios', {
    id: serial('id').primaryKey(),
    servicio: varchar('servicio', { length: 256 }).notNull(),
});
