import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const tblCompanias = pgTable('companias', {
    id: varchar('id', { length: 15 }).primaryKey(),
    compania: varchar('compania', { length: 256 }).notNull(),
});

// INSERT INTO companias (id, compania) VALUES ('qualitas', 'Qualitas');
// INSERT INTO companias (id, compania) VALUES ('axa', 'AXA');
// INSERT INTO companias (id, compania) VALUES ('anaseguros', 'ANA Seguros');
// INSERT INTO companias (id, compania) VALUES ('gnp', 'GNP');
// INSERT INTO companias (id, compania) VALUES ('allianz', 'allianz');
// INSERT INTO companias (id, compania) VALUES ('bupa', 'bupa');
// INSERT INTO companias (id, compania) VALUES ('hdi', 'hdi');
