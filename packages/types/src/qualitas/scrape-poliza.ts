export type QualitasScrappedPoliza = {
    resumen?: QualitasScrappedPolizaResumen
    estatus?: QualitasScrappedPolizaEstatus
    recibos?: QualitasScrappedPolizaRecibos
    siniestros?: QualitasScrappedPolizaSiniestro[]
}

export type QualitasScrappedPolizaSiniestro = {
    numero_reporte: string
    fecha_reporte: string
    hora: string
    numero_siniestro: string
    causa: string
    fecha_ocurrido: string
    hora_ocurrido: string
    detalle: {
        key: string;
        value: string;
    }[]
    vehiculo: {
        key: string;
        value: string;
    }[]
    ajustador: {
        key: string;
        value: string;
    }[]
    involucrados: QualitasScrappedPolizaSiniestroInvolucrado[]
}

export type QualitasScrappedPolizaSiniestroInvolucrado = {
    conductor?: string
    tipo_involucrado?: string
    folio_asignacion?: string
    proveedor?: string
}

export type QualitasScrappedPolizaEstatus = {
    endosos: QualitasScrappedPolizaEstatusEndoso[]
}

export type QualitasScrappedPolizaEstatusEndoso =
    {
        endoso: string
        fecha_vencimiento: string
        num_recibo: string
        remesa: string
        fecha_pago: string
        importe: string
        estado: string
        tipo_movimiento: string
    }

export type QualitasScrappedPolizaRecibos =
    {
        numero_recibo: string
        serie: string
        vigencia: string
        folio: string
        serie_emision: string
        importe_total: string
        estado: string
    }[]

export type QualitasScrappedPolizaResumen = {
    numero_poliza: string;
    title: string;
    isExpanded: boolean;
    serialData: {
        key: string;
        value: string;
    }[];
    coberturas: ScrappedPolizaCobertura[];
}

export type ScrappedPolizaCobertura = {
    cobertura: string;
    sumaAsegurada: string;
    deducible: string;
    prima: string;
}