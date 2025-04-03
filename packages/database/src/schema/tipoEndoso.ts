import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tblTipoEndoso = pgTable('tipo_endoso', {
    id: serial('id').primaryKey(),
    tipoEndoso: varchar('tipo_endoso', { length: 256 }).unique().notNull(),
});
