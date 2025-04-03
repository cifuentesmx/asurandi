import { SiniestroDetalle, SiniestroActividad } from '@asurandi/types';
import { bigint, bigserial, jsonb, numeric, pgTable, varchar, date, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { tblPolizas } from './polizas.js';
import { tblAgentes } from './agentes.js';
import { tblConductos } from './conductos.js';
import { tblAsegurados } from './asegurados.js';
import { tblVehiculos } from './vehiculos.js';
import { tblSiniestroCausas } from './siniestrocausas.js';
import { tblCompanias } from './companias.js';



export const tblSiniestros = pgTable('siniestros', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }).references(() => tblPolizas.id),
    agenteId: integer('agente_id').references(() => tblAgentes.id),
    conductoId: integer('conducto_id').references(() => tblConductos.id),
    aseguradoId: bigint('asegurado_id', { mode: 'number' }).references(() => tblAsegurados.id),
    vehiculoId: bigint('vehiculo_id', { mode: 'number' }).references(() => tblVehiculos.id),
    causaId: integer('causa_id').references(() => tblSiniestroCausas.id),
    companyId: varchar('company_id', { enum: ['qualitas'] }).references(() => tblCompanias.id),
    polizaPrimaneta: numeric('poliza_primaneta', { scale: 2, precision: 12 }).default('0'),
    numeroSiniestro: varchar('numero_siniestro', { length: 20 }).unique(),
    montoEstimado: numeric('monto_estimado', { scale: 2, precision: 12 }),
    montoActualizado: numeric('monto_actualizado', { scale: 2, precision: 12 }),
    montoFinal: numeric('monto_final', { scale: 2, precision: 12 }),
    fechaSiniestro: date('fecha_siniestro'),
    horaSiniestro: varchar('hora_siniestro', { length: 25 }),
    fechaReporte: date('fecha_reporte'),
    horaReporte: varchar('hora_reporte', { length: 25 }),
    fechaCierre: date('fecha_cierre'),
    codigoPostal: varchar('codigo_postal', { length: 8 }),
    detalle: jsonb('detalle').default({}).$type<SiniestroDetalle>(),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
    updated: timestamp('updated', { mode: 'date' }).defaultNow(),
    actividades: jsonb('actividades').default([]).$type<SiniestroActividad[]>(),
    numeroReporte: varchar('numero_reporte'),
    enSeguimiento: boolean('en_seguimiento'), // 0 = por asignar, 1= en seguimiento
});
