export type ScrappedPoliza = {
    resumen?: ScrappedPolizaResumen
    estatus?: ScrappedPolizaEstatus
    recibos?: ScrappedPolizaRecibos
    siniestros?: ScrappedPolizaSiniestro[]
}

export type ScrappedPolizaSiniestro = {
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
    involucrados: ScrappedPolizaSiniestroInvolucrado[]
}

export type ScrappedPolizaSiniestroInvolucrado = {
    conductor?: string
    tipo_involucrado?: string
    folio_asignacion?: string
    proveedor?: string
}

export type ScrappedPolizaEstatus = {
    endosos: ScrappedPolizaEstatusEndoso[]
}

export type ScrappedPolizaEstatusEndoso =
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

export type ScrappedPolizaRecibos =
    {
        numero_recibo: string
        serie: string
        vigencia: string
        folio: string
        serie_emision: string
        importe_total: string
        estado: string
    }[]

export type ScrappedPolizaResumen = {
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