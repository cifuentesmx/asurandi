import type { QualitasScrappedPolizaEstatusEndoso, QualitasScrappedPolizaRecibos, QualitasScrappedPolizaSiniestro } from './scrape-poliza.js';

export type QualitasScrappedFlota = {
    resumen: QualitasScrappedFlotaResumen[]
    incisos: QualitasScrappedFlotaInciso[]
}

export type QualitasScrappedFlotaResumen = {
    key: string
    value: string
}

export type QualitasScrappedFlotaInciso = {
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
    polizaInciso: QualitasScrappedFlotaPolizaInciso
}

export type QualitasScrappedFlotaPolizaInciso = {
    serialData: { key: string, value: string }[]
    coberturas: {
        cobertura: string;
        sumaAsegurada: string;
        deducible: string;
        prima: string;
    }[];
    statusPoliza: QualitasScrappedPolizaEstatusEndoso[]

    recibos: QualitasScrappedPolizaRecibos
    siniestros: QualitasScrappedPolizaSiniestro[]
}

