import { bigint, bigserial, pgTable, varchar, date, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { tblPolizas } from './polizas.js';
import { tblAgentes } from './agentes.js';
import { tblConductos } from './conductos.js';
import { tblAsegurados } from './asegurados.js';
import { tblVehiculos } from './vehiculos.js';
import { tblCompanias } from './companias.js';

export const tblPolizaMovimientos = pgTable('poliza_movimientos', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    polizaId: bigint('poliza_id', { mode: 'number' }).references(() => tblPolizas.id),
    agenteId: integer('agente_id').references(() => tblAgentes.id),
    numeroPoliza: varchar('numero_poliza', { length: 40 }),
    conductoId: integer('conducto_id').references(() => tblConductos.id),
    aseguradoId: bigint('asegurado_id', { mode: 'number' }).references(() => tblAsegurados.id),
    vehiculoId: bigint('vehiculo_id', { mode: 'number' }).references(() => tblVehiculos.id),
    companyId: varchar('company_id').references(() => tblCompanias.id),
    tipoMovimiento: varchar('tipo_movimiento', { enum: ['CANCELADA', 'EMITIDA', 'NO RENOVADA', 'PAGADA', 'RENOVACION PRÓXIMA', 'RENOVADA', 'CAMBIO', 'REGISTRO'] }),
    motivo: varchar('motivo'),
    fechaMovimiento: date('fecha_movimiento'),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
},
    (t) => {
        return [

            index('unique_poliza_movimiento_idx').on(t.saasId, t.numeroPoliza, t.fechaMovimiento, t.tipoMovimiento, t.polizaId)
        ]

    }
);
