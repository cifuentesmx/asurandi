import { extractFullText } from "utils/extractFullTextFromPDF.js";

export type DataFromPdf = Awaited<ReturnType<typeof extractDataFromPdf>>

export const extractDataFromPdf = async (data: any[]) => {
    const file = data[0].file.path;
    const company = "anaseguros";
    let pages: number = 0;
    let title: string = "";
    let cobertura: string = "";
    let numero_poliza: string = "";
    let endoso: string = "";
    let inciso: string | null = null;
    let solicitud: string | null = null;
    let fechaEmision: { dia?: string, mes?: string, anio?: string } = {};
    let inicioVigencia: { dia?: string, mes?: string, anio?: string } = {};
    let finVigencia: { dia?: string, mes?: string, anio?: string } = {};
    const incisos: {
        [key: string]: Partial<{
            endoso: string;
            inciso: string;
            poliza: string;
            page: number;
            vigencia: Vigencia;
            movimiento: string;
            prima: Partial<{
                prima_neta: string;
                tasa_financiamiento: string;
                gastos_expedicion: string;
                subtotal: string;
                iva: string;
                importe_total: string;
            }>;
            vehiculo: Partial<{
                codigo: string;
                descripcion: string;
                tipo: string;
                serie: string;
                modelo: string;
                motor: string;
                color: string;
                repuve: string;
                ocupantes: string;
                placas: string;
                observaciones: string;
                conductor_habitual: string;
                uso: string;
                servicio: string;

            }>;
            pago: Partial<{
                fecha_vencimiento: string;
                moneda: string;
                plazo_pago: string;
                forma_pago: string;
                primer_pago: string;
                pagos_subsecuentes: string;
                prima_neta: string;
                tarifa_aplicada: string;
                prima_total: string;
                iva: string;
                gastos_expedicion: string;
                recargos: string;
            }>;
            coberturas: {
                cobertura: string;
                deducible: string;
                limite_responsabilidad: string;
                prima: string;
            }[];
        }>[]
    } = {};
    const asegurado: Partial<{
        id: string;
        nombre: string;
        domicilio: string;
        cp: string;
        municipio: string;
        estado: string;
        colonia: string;
        rfc: string;
    }> = {};
    type Vigencia = Partial<{
        fecha_expedicion: string;
        desde: string;
        hasta: string;
    }>;


    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        const { x, y, text } = element;


        // Page count
        if (!!element.page) {
            pages = element.page;
        }

        // inciso
        if (x === 12.506 && y === 4.034 && pages) {
            inciso = extractFullText(data, i)

            if (!incisos[inciso]) {
                incisos[inciso] = []
            }
            if (!incisos[inciso][pages]) {
                incisos[inciso][pages] = {
                    page: pages,
                }
            }
        }
        // Title
        if (
            (!title && x === 1.522 && y === 2.793 && text)
        ) {
            title = extractFullText(data, i);
        }

        // cobertura
        if (!cobertura && x === 14.277 && y === 9.171 && pages === 1) {
            cobertura = extractFullText(data, i)
        }



        // numero_poliza
        if (!numero_poliza && x === 5.596 && y === 4.034 && pages === 1) {
            numero_poliza = extractFullText(data, i)
        }

        // endoso
        if (!endoso && x === 19.238 && y === 4.034 && pages === 1) {
            endoso = extractFullText(data, i)
        }

        // fechas
        if (y === 8.108) {

            // inicioVigencia
            if (!inicioVigencia.dia && x === 24.731) {
                inicioVigencia.dia = extractFullText(data, i)
            }
            if (!inicioVigencia.mes && x === 26.147) {
                inicioVigencia.mes = extractFullText(data, i)
            }
            if (!inicioVigencia.anio && x === 27.565) {
                inicioVigencia.anio = extractFullText(data, i)
            }


            // finVigencia
            if (!finVigencia.dia && x === 29.957) {
                finVigencia.dia = extractFullText(data, i)
            }
            if (!finVigencia.mes && x === 31.462) {
                finVigencia.mes = extractFullText(data, i)
            }
            if (!finVigencia.anio && x === 32.88) {
                finVigencia.anio = extractFullText(data, i)
            }

            // emision
            if (!fechaEmision.dia && x === 19.593) {
                fechaEmision.dia = extractFullText(data, i)
            }
            if (!fechaEmision.mes && x === 21.01) {
                fechaEmision.mes = extractFullText(data, i)
            }
            if (!fechaEmision.anio && x === 22.427) {
                fechaEmision.anio = extractFullText(data, i)
            }
        }

        // clienteId
        if (!asegurado.id && x === 12.506 && y === 4.742 && pages === 1) {
            asegurado.id = extractFullText(data, i)
        }
        // rfc
        if (!asegurado.rfc && x === 3.647 && y === 4.742 && pages === 1) {
            asegurado.rfc = extractFullText(data, i)
        }
        // nombre_asegurado
        if (!asegurado.nombre && x === 1.522 && y === 5.805 && pages === 1) {
            asegurado.nombre = extractFullText(data, i)
        }

        // domicilio
        if (!asegurado.domicilio && x === 1.522 && y === 7.206 && pages === 1) {
            asegurado.domicilio = extractFullText(data, i)
        }

        // cp
        if (!asegurado.cp && text && text.startsWith("C.P.")) {
            const txt = extractFullText(data, i)
            asegurado.cp = txt.substring(4, 9)
            asegurado.municipio = txt.substring(10, txt.length).trim()
        }


        // solicitud
        if (!solicitud && x === 5.419 && y === 9.171 && pages === 1) {
            solicitud = extractFullText(data, i)
        }

        if (!inciso || !pages) continue;

        const cInciso = incisos[inciso][pages] ?? {}

        // forma_pago
        if (!cInciso.pago?.forma_pago && x === 14.986 && y === 10.589) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.forma_pago = extractFullText(data, i)
        }

        // primer_pago  
        if (!cInciso.pago?.primer_pago && x === 23.824 && y === 9.89) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.primer_pago = extractFullText(data, i)
        }

        // pagos_subsecuentes
        if (!cInciso.pago?.pagos_subsecuentes && x === 23.824 && y === 10.599) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.pagos_subsecuentes = extractFullText(data, i)
        }

        // prima_neta
        if (!cInciso.pago?.prima_neta && x === 23.477 && y === 11.307) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.prima_neta = extractFullText(data, i)
        }

        // prima_total  
        if (!cInciso.pago?.prima_total && x === 31.183 && y === 11.307) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.prima_total = extractFullText(data, i)
        }

        // iva
        if (!cInciso.pago?.iva && x === 31.357 && y === 10.599) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.iva = extractFullText(data, i)
        }

        // recargos
        if (!cInciso.pago?.recargos && x === 31.531 && y === 9.182) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.recargos = extractFullText(data, i)
        }

        // gastos_expedicion
        if (!cInciso.pago?.gastos_expedicion && x === 31.531 && y === 9.89) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.gastos_expedicion = extractFullText(data, i)
        }

        // moneda
        if (!cInciso.pago?.moneda && x === 14.277 && y === 9.88) {
            if (!cInciso.pago) {
                cInciso.pago = {}
            }
            cInciso.pago.moneda = extractFullText(data, i)
        }

        // vehiculo.tipo
        if (!cInciso.vehiculo?.tipo && x === 3.116 && y === 12.36) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.tipo = extractFullText(data, i)
        }

        // vehiculo.codigo
        if (!cInciso.vehiculo?.codigo && x === 3.825 && y === 13.777) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.codigo = extractFullText(data, i)
        }

        // vehiculo.descripcion
        if (!cInciso.vehiculo?.descripcion && x === 11.443 && y === 12.36) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.descripcion = extractFullText(data, i)
        }

        // vehiculo.modelo
        if (!cInciso.vehiculo?.modelo && x === 31.64 && y === 13.069) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.modelo = extractFullText(data, i)
        }

        // vehiculo.motor
        if (!cInciso.vehiculo?.motor && x === 10.38 && y === 13.069) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.motor = extractFullText(data, i)
        }

        // vehiculo.serie
        if (!cInciso.vehiculo?.serie && x === 19.149 && y === 13.777) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.serie = extractFullText(data, i)
        }
        // vehiculo.placas
        if (!cInciso.vehiculo?.placas && x === 31.64 && y === 13.777) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.placas = extractFullText(data, i)
        }

        // vehiculo.ocupantes
        if (!cInciso.vehiculo?.ocupantes && x === 20.921 && y === 13.069) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.ocupantes = extractFullText(data, i).replace("PASAJEROS", "").trim()
        }
        // vehiculo.uso
        if (!cInciso.vehiculo?.uso && x === 4.179 && y === 9.88) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.uso = extractFullText(data, i)
        }

        // vehiculo.servicio
        if (!cInciso.vehiculo?.servicio && x === 4.179 && y === 10.589) {
            if (!cInciso.vehiculo) {
                cInciso.vehiculo = {}
            }
            cInciso.vehiculo.servicio = extractFullText(data, i)
        }


    }
    return {
        meta: {
            file,
            pages,
            title,
            versions: ["2025"],
            source: "extractDataFromPdf",
            timestamp: Date.now(),
        },
        poliza: {
            isPoliza: true,
            isEndoso: Number(endoso) > 0 ? true : false,
            company,
            cobertura,
            numero_poliza,
            endoso,
            solicitud,
            fechaEmision,
            inicioVigencia,
            finVigencia,
        },
        asegurado,
        incisos,
    };
}