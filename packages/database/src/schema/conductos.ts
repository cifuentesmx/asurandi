import { index, integer, pgTable, primaryKey, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tblAgentes } from './agentes.js';

export const tblConductos = pgTable('conductos', {
    id: serial('id').primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    nexusId: integer('nexus_id'),
    nombre: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 200 }),
    alias: varchar('alias'),
    phone: varchar('phone', { length: 50 }),
    sendTareas: varchar('send_tareas', { length: 10, enum: ['weekly', 'monthly'] }),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
    uid: varchar('firebase_uid'),
}, (tblConducto) => {
    return [

        index('conductos_name_idx')
            .on(tblConducto.saasId, tblConducto.nombre),
        index('conductos_nexus_idx')
            .on(tblConducto.saasId, tblConducto.nexusId),
        index('firebase_conducto_uid')
            .on(tblConducto.uid),
    ]

});

export const conductosRelations = relations(tblConductos, ({ many }) => ({
    agentesToConductos: many(agentesToConductos)
}))

export const agentesToConductos = pgTable('agentes_to_conductos', {
    agenteId: integer('agente_id').notNull().references(() => tblAgentes.id),
    conductoId: integer('conducto_id').notNull().references(() => tblAgentes.id),
},
    (t) => {
        return [primaryKey({ columns: [t.agenteId, t.conductoId] })]
    }
)

export const agentesToConductosRelations = relations(agentesToConductos, ({ one }) => ({
    agente: one(tblAgentes, {
        fields: [agentesToConductos.agenteId],
        references: [tblAgentes.id]
    }),
    conducto: one(tblConductos, {
        fields: [agentesToConductos.conductoId],
        references: [tblConductos.id]
    })
}))