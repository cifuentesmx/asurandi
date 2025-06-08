import { DataFromPdf } from "./extactDataFromPdf.js"

export const getInciso = (incisos: DataFromPdf['incisos'], inciso: string) => {
    const incisoData = incisos[`${inciso}`]
    if (!incisoData) throw new Error("No se encontró el inciso para extraer los datos");
    const data: Partial<DataFromPdf['incisos'][string][number]> = {}
    for (const i of incisoData) {
        if (!i) continue
        if (!data.coberturas && i.coberturas) data.coberturas = i.coberturas
        if (!data.pago && i.pago) data.pago = i.pago
        if (!data.prima && i.prima) data.prima = i.prima
        if (!data.vehiculo && i.vehiculo) data.vehiculo = i.vehiculo
        if (!data.vigencia && i.vigencia) data.vigencia = i.vigencia
        if (!data.movimiento && i.movimiento) data.movimiento = i.movimiento
        if (!data.endoso && i.endoso) data.endoso = i.endoso
    }
    return data
}