import type { ScrappedPolizaEstatusEndoso, ScrappedPolizaRecibos, ScrappedPolizaSiniestro } from './scrape-poliza.js';

export type ScrappedFlota = {
    resumen: ScrappedFlotaResumen[]
    incisos: ScrappedFlotaInciso[]
}

export type ScrappedFlotaResumen = {
    key: string
    value: string
}

export type ScrappedFlotaInciso = {
    inciso: string
    numero_economico: string
    vigencia: string
    endoso: string
    descripcion: string
    cobertura: string
    serie: string
    placas: string
    estatus: string
    prima_neta: string
    polizaInciso: ScrappedFlotaPolizaInciso
}

export type ScrappedFlotaPolizaInciso = {
    serialData: { key: string, value: string }[]
    coberturas: {
        cobertura: string;
        sumaAsegurada: string;
        deducible: string;
        prima: string;
    }[];
    statusPoliza: ScrappedPolizaEstatusEndoso[]

    recibos: ScrappedPolizaRecibos
    siniestros: ScrappedPolizaSiniestro[]
}

