import { pgTable, varchar, text, date, boolean, bigserial, integer, bigint, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { tblAgentes } from './agentes.js';
import { tblConductos } from './conductos.js';
import { relations } from 'drizzle-orm';
import { tblAsegurados } from './asegurados.js';

export const tblContactos = pgTable('contactos', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id'),
    agenteId: integer('agente_id').references(() => tblAgentes.id),
    conductoId: integer('conducto_id').references(() => tblConductos.id),
    nombre: varchar('nombre', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    rfc: varchar('13'),
    telefono: varchar('telefono', { length: 40 }),
    direccion: text('direccion'),
    ciudad: varchar('ciudad', { length: 100 }),
    pais: varchar('pais', { length: 100 }),
    fechaNacimiento: date('fecha_nacimiento'),
    esCliente: boolean('es_cliente').default(false),
    fechaCreacion: date('fecha_creacion').defaultNow(),
    fechaConversion: date('fecha_conversion'),
    fechaActualizacion: date('fecha_actualizacion').defaultNow(),
    created: timestamp('created', { mode: 'date' }).defaultNow(),

});

export const aseguradosToContactos = pgTable('asegurados_to_contactos', {
    aseguradoId: bigint('asegurado_id', { mode: 'number' }).notNull().references(() => tblAsegurados.id),
    contactoId: bigint('contacto_id', { mode: 'number' }).notNull().references(() => tblContactos.id),
    created: timestamp('created', { mode: 'date' }).defaultNow(),

},
    (t) => {
        return [
            primaryKey({ columns: [t.aseguradoId, t.contactoId] })

        ]
    }
)

export const aseguradosRelations = relations(tblAsegurados, ({ many }) => ({
    contactsToAsegurados: many(aseguradosToContactos)
}))

export const contactsRelations = relations(tblContactos, ({ many }) => ({
    contactsToAsegurados: many(aseguradosToContactos)
}))

export const contactosToAseguradosRelations = relations(aseguradosToContactos, ({ one }) => ({
    asegurado: one(tblAsegurados, {
        fields: [aseguradosToContactos.aseguradoId],
        references: [tblAsegurados.id]
    }),
    contacto: one(tblContactos, {
        fields: [aseguradosToContactos.aseguradoId],
        references: [tblContactos.id]
    }),
}))