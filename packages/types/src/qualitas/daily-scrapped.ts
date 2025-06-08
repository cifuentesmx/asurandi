import { Aseguradoras } from "../company/index.js"

export type PolizasToScrapeFromDaily = {
    porRenovar?: PolizaPorRenovar
    porCobrar?: PolizaPorCobrar[]
    canceladas?: PolizaCancelada
    noRenovadas?: PolizaNoRenovada
    porVencer?: PolizaPorVencer
    pagadas?: PolizaPagada
    renovadas?: PolizaRenovada
    siniestradas?: PolizaSiniestrada[]
    emitidas?: PolizaEmitida
    movimientosAnaseguros?: MovimientoPolizaAnaseguros[]
}

export type MovimientoPolizaAnaseguros = {
    fecha_emision: string
    inicio_vigencia: string
    fin_vigencia: string
    poliza: string
    endoso: string
    asegurado: string
    vehiculo_descripcion: string
    vehiculo_serie: string
    vehiculo_modelo: string
    cobertura: string
    formapago: string
    prima_neta: string
    prima_total: string
    origen: string
    fecha_cancelacion: string
    motivo_cancelacion: string
}

export type PolizaEmitida = {
    company: Aseguradoras
    poliza: string
    ramo: string
    endoso: string
    fechaEmision: string
    inicioVigencia: string
    moneda: string
    primaRecibo: string
    tipoMovimiento: string
}

export type PolizaRenovada = {
    company: Aseguradoras
    polizaAnterior: string
    fechaVencimiento: string
    datos: string
    asegurado: string
    planPago: string
    polizaRenovada: string
}

export type PolizaNoRenovada = {
    company: Aseguradoras
    poliza: string
    primaTotal: string
    asegurado: string
    numeroSerie: string
    fechaVencimiento: string
    causaNoRenovación: string
}

export type PolizaPagada = {
    company: Aseguradoras
    poliza: string
    ramo: string
    endoso: string
    recibo: string
    serie: string
    fechaPago: string
    asegurado: string
    moneda: string
    primaRecibo: string

}

export type PolizaCancelada = {
    company: Aseguradoras
    poliza: string
    ramo: string
    endoso: string
    fechaCancelacion: string
    causa: string
    primaRecibo: string
}

export type PolizaSiniestrada = {
    company: Aseguradoras
    poliza: string
    numSiniestro: string
    ejercicio: string
    reporte: string
    estimacion: string
    fecha: string
}

export type PolizaPorVencer = {
    company: Aseguradoras
    poliza: string
    formapago: string
    fechaHasta: string
    asegurado: string
    nombreAsegurado: string
    vehiculo: string

}

export type PolizaPorRenovar = {
    company: Aseguradoras
    checked: string
    poliza: string
    fechaVencimiento: string
    automovil: string
    asegurado: string
    planPago: string
    descuentoCartera: string
    descuentoBuenaConducta: string
    primaTotalActualAnterior: string
    estatus: string
    editar: string
    causaNoRenovacion: string
}

export type PolizaPorCobrar = {
    company: Aseguradoras
    poliza: string
    ramo: string
    endoso: string
    fechaVencimiento: string
    periodoGracia: string
    formaPago: string
    asegurado: string
    serie: string
    numeroRecibo: string
    moneda: string
    importe: string
    actividad: string
}