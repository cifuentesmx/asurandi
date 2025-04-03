import type { PublicFileUrl } from "../saas/files.js"

export type GetOnePolizaResponse = Partial<{
    poliza: GetOnePoliza
    movimientos: GetOnePolizaMovimiento[]
    siniestros: GetOnePolizaSiniestros
}>

export type GetOnePoliza = Partial<{
    id: number
    saasId: string
    esMaestra: boolean
    ramoId: number
    subRamoId: number
    companyId: string
    agenteId: number
    conductoId: number
    vehiculoId: number
    asegurado_id: number
    usoId: number
    servicioId: number
    placas: string
    numeroSerie: string
    numeroEconomico: string
    numeroPoliza: string
    polizaAnterior: string
    polizaRenovada: string
    cobertura: string
    totalIncisos: number
    incisosVigentes: number
    incisosCancelados: number
    inciso: string
    endoso: string
    oficinaEmision: string
    porcentajeDescuento: string
    fechaEmision: string
    vigenciaInicio: string
    vigenciaFin: string
    tarifa: string
    modoPagoId: number
    moneda: string
    descripcionPago: string
    periodoGracia: string
    primaNeta: string
    recargoFinacieroPorcentual: string
    financiamiento: string
    costoExpedicion: string
    subtotal: string
    iva: string
    total: string
    coberturas: GetOneCobertura[]
    polizaEstatus: string
    created: string
    lastSync: string
    origenId: number
    agente: string
    conducto: string
    asegurado: string
    aseguradoDireccion: string
    aseguradoRfc: string
    aseguradoCelular: string
    motor: string
    vehiculo: string
    vehiculoDescripcion: string
    origen: string
    ramo: string
    subramo: string
    uso: string
    servicio: string
    modoPago: string
    company: string
    vehiculoTipo: string
    vehiculoCarroceria: string
    vehiculoColor: string
    vehiculoOcupantes: number
}>
export type GetOneCobertura = Partial<{
    prima: string
    cobertura: string
    deducible: string
    sumaAsegurada: string
}>

export type GetOnePolizaMovimiento = Partial<{
    created: string
    motivo: string
    tipoMovimiento: string
    fechaMovimiento: string
}>

export type GetOnePolizaSiniestros = Partial<{
    id: number
    saasId: string
    polizaId: number
    agenteId: number
    conductoId: number
    aseguradoId: number
    vehiculoId: number
    causaId: number
    companyId: string
    polizaPrimaneta: string
    numeroSiniestro: string
    montoEstimado: string
    montoActualizado: string
    montoFinal: string
    fechaSiniestro: string
    horaSiniestro: string
    fechaReporte: string
    horaReporte: string
    fechaCierre: string
    codigoPostal: string
    detalle: SiniestroDetalle
    created: string
    updated: string
    actividades: SiniestroActividad
    numeroReporte: string
    enSeguimiento: boolean
    causa: string
}>

type SiniestroDetalle = {
    numeroReporte?: string
    fechaReporte?: string
    colonia?: string,
    comentarios?: string,
    causa?: string
    telefono?: string,
    conductor?: string
    ubicacion?: string
    ajustador?: {
        nombre?: string,
        llegada?: string,
        termino?: string,
    }
    involucrados?: {
        conductor?: string
        tipo_involucrado?: string
        folio_asignacion?: string
        proveedor?: string
    }[]

}

type SiniestroActividad = {
    tipoActividad: 'Status' | 'Cierre'
    files?: PublicFileUrl[]
    comentario?: string
    user: string,
    timestamp: number
}