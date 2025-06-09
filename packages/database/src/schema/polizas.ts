import { PolizaMetaData, ScrappedPolizaCobertura } from '@asurandi/types';
import {
    integer, pgTable, date, uniqueIndex, varchar, numeric, jsonb, bigserial, bigint,
    boolean, smallint,
    timestamp
} from 'drizzle-orm/pg-core';
import { tblRamos } from './ramos.js';
import { tblSubRamos } from './subRamo.js';
import { tblCompanias } from './companias.js';
import { tblAgentes, tblConductos } from './agentes_conductos.js';
import { tblVehiculos } from './vehiculos.js';
import { tblAsegurados } from './asegurados.js';
import { tblUsos } from './usos.js';
import { tblServicios } from './servicios.js';
import { tblModoPagos } from './modopagos.js';
import { tblPolizaOrigen } from './polizaOrigen.js';


export const tblPolizas = pgTable('polizas', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    esMaestra: boolean('es_maestra').default(true),
    ramoId: integer('ramo_id').references(() => tblRamos.id),
    subRamoId: integer('subramo_id').references(() => tblSubRamos.id),
    companyId: varchar('company_id').references(() => tblCompanias.id),
    agenteId: integer('agente_id').references(() => tblAgentes.id),
    conductoId: integer('conducto_id').references(() => tblConductos.id),
    vehiculoId: bigint('vehiculo_id', { mode: 'number' }).references(() => tblVehiculos.id),
    asegurado_id: bigint('asegurado_id', { mode: 'number' }).references(() => tblAsegurados.id),
    usoId: integer('uso_id').references(() => tblUsos.id),
    servicioId: integer('servicio_id').references(() => tblServicios.id),
    placas: varchar('placas', { length: 20 }),
    numeroSerie: varchar('numero_serie', { length: 40 }),
    numeroEconomico: varchar('numero_economico', { length: 40 }),
    numeroPoliza: varchar('numero_poliza', { length: 40 }),
    polizaAnterior: varchar('poliza_anterior', { length: 40 }),
    polizaRenovada: varchar('poliza_renovada', { length: 40 }),
    cobertura: varchar('cobertura', { length: 40 }),
    totalIncisos: smallint('total_incisos').default(1),
    incisosVigentes: smallint('incisos_vigentes').default(1),
    incisosCancelados: smallint('incisos_cancelados').default(0),
    inciso: varchar('inciso', { length: 20 }),
    endoso: varchar('endoso', { length: 20 }),
    oficinaEmision: varchar('oficina_emision', { length: 40 }),
    porcentajeDescuento: numeric('descuento_porcentual', { scale: 2, precision: 5 }).default('0'),
    fechaEmision: date('fecha_emision'),
    vigenciaInicio: date('vigencia_inicio'),
    vigenciaFin: date('vigencia_fin'),
    tarifa: varchar('tarifa', { length: 20 }),
    modoPagoId: integer('modopago_id').references(() => tblModoPagos.id),
    moneda: varchar('moneda', { length: 3 }).default('MXN'),
    descripcionPago: varchar('descripcion_pago', { length: 200 }),
    periodoGracia: integer('periodo_gracia'),
    primaNeta: numeric('prima_neta', { scale: 2, precision: 12 }),
    recargoFinacieroPorcentual: numeric('recargo_financiero_porcentual', { scale: 2, precision: 5 }),
    financiamiento: numeric('financiamiento', { scale: 2, precision: 12 }),
    recargos: numeric('recargos', { scale: 2, precision: 12 }),
    costoExpedicion: numeric('costo_expedicion', { scale: 2, precision: 9 }),
    subtotal: numeric('subtotal', { scale: 2, precision: 12 }),
    iva: numeric('iva', { scale: 2, precision: 9 }),
    total: numeric('total', { scale: 2, precision: 12 }),
    coberturas: jsonb('coberturas').default([]).$type<ScrappedPolizaCobertura[]>(),
    polizaEstatus: varchar('poliza_estatus', { enum: ['Emitida', 'Pagada', 'Por vencer', 'Cancelada', 'No renovada', 'Renovada'] }).default('Emitida'),
    primaNetaComision: numeric('prima_neta_comision', { scale: 2, precision: 12 }),
    porcentajeComision: numeric('porcentaje_comision', { scale: 2, precision: 5 }),
    created: timestamp('created', { mode: 'date' }).defaultNow(),
    lastSync: date('last_sync'),
    claveAgente: varchar('clave_agente'),
    origenId: integer('origen_id').references(() => tblPolizaOrigen.id),
    metaData: jsonb('meta_data').default({}).$type<PolizaMetaData>(),
},
    (tblPoliza) => [
        uniqueIndex('numero_poliza_idx').on(tblPoliza.saasId, tblPoliza.numeroPoliza, tblPoliza.inciso),
    ]

);
