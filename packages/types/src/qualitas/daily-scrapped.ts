export type QualitasScrappedDailyStats = {
    renovadas: PolizasRenovadas
    noRenovadas: PolizasNoRenovadas
    pagadas: PolizasPagadas
    canceladas: PolizasCanceladas
    porVencer: PolizasPorVencer
    porRenovar: PolizasPorRenovar
    porCobrar: PolizasPorCobrar
}

export type PolizasRenovadas = {
    polizaAnterior: string
    fechaVencimiento: string
    datos: string
    asegurado: string
    planPago: string
    polizaRenovada: string
}[]

export type PolizasNoRenovadas = {
    poliza: string
    primaTotal: string
    asegurado: string
    numeroSerie: string
    fechaVencimiento: string
    causaNoRenovación: string
}[]

export type PolizasPagadas = {
    poliza: string
    ramo: string
    endoso: string
    recibo: string
    serie: string
    fechaPago: string
    asegurado: string
    moneda: string
    primaRecibo: string

}[]

export type PolizasCanceladas = {

    poliza: string
    ramo: string
    endoso: string
    fechaCancelacion: string
    causa: string
    primaRecibo: string
}[]

export type PolizasSiniestradas = {
    poliza: string
    numSiniestro: string
    ejercicio: string
    reporte: string
    estimacion: string
    fecha: string
}[]

export type PolizasPorVencer = {

    poliza: string
    formapago: string
    fechaHasta: string
    asegurado: string
    nombreAsegurado: string
    vehiculo: string

}[]

export type PolizasPorRenovar = {
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
}[]

export type PolizasPorCobrar = {
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
}[]