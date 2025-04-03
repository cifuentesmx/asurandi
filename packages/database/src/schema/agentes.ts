import { integer, pgTable, serial, index, varchar, timestamp } from 'drizzle-orm/pg-core';
import {  relations } from 'drizzle-orm';
import { agentesToConductos, tblConductos } from './conductos.js';

export const tblAgentes = pgTable('agentes', {
    id: serial('id').primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    nexusId: integer('nexus_id'),
    nombre: varchar('nombre').notNull(),
    alias: varchar('alias'),
    phone: varchar('phone'),
    email: varchar('email'),
    conductoId: integer('conducto_id').references(() => tblConductos.id),
    qualitasId: varchar('qualitas_id'),
    anaId: varchar('anaseguros_id'),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
    uid: varchar('firebase_uid'),
},

    (table) => {
        return [ 
            index('account_nombre_idx')
                .on(table.saasId, table.nombre),
            index('firebase_agente_uid')
                .on(table.uid)
        ]
    });

export const agentesRelations = relations(tblAgentes, ({ many }) => ({
    agentesToConductos: many(agentesToConductos)
}))