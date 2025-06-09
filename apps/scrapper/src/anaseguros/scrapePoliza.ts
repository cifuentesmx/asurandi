import { tblPolizas } from "@asurandi/database"
import { PolizasToScrapeFromDaily } from "@asurandi/types"
import { pgDb } from "database/db.js"
import { and, eq } from "drizzle-orm"
import { processScrapped } from "./processScrapped/index.js"

export type ScrappedAnasegurosPoliza = {
    agente: string
    fechaEmision: string
    vigenciaInicio: string
    vigenciaFin: string
    poliza: string
    endoso: string
    nombreAsegurado: string
    vehiculoAsegurado: string
    modelo: string
    serie: string
    placa: string
    cobertura: string
    formaPago: string
    metodoPago: string
    primaTotal: string
    origen: string
    motivoCancelacion: string
    acciones: string
    link: string
    aseguradoId: string | null
    recibos: ScrappedAnasegurosRecibo[]
    dataFromDailyScrapper: PolizasToScrapeFromDaily
    siniestros: ScrappedAnasegurosSiniestro[]
}

export type ScrappedAnasegurosSiniestro = {
    ejercicio: string
    siniestro: string
    endoso: string
    inciso: string
    fechaOcurrido: string
    fechaReclamo: string
    detalle: string
    estimado: string
    cobertura: string
    montoEst: string
    pagos: string
}

export type ScrappedAnasegurosRecibo = {
    no: string
    inicioVigencia: string
    cantidad: string
    recibo: string
    estatusPago: string
    fechaAplicacion: string
    fechaPago: string
    estatusRecibo: string
}

export const scrapePoliza = async (
    numero_poliza: string,
    browser: WebdriverIO.Browser, saasId: string,
    agente: string,
    dataFromDailyScrapper?: PolizasToScrapeFromDaily,
):
    Promise<void> => {
    await browser.url(`https://server.anaseguros.com.mx/ananet/pages/Poliza.aspx`)
    const selectTipoBusqueda = browser.$('#CmbBusqueda')
    const inputBuscar = browser.$('#TxtBuscar')
    await selectTipoBusqueda.waitForClickable()
    await selectTipoBusqueda.selectByVisibleText('PÓLIZA')

    await inputBuscar.waitForDisplayed()
    await inputBuscar.setValue(numero_poliza)
    await browser.pause(500)

    const btnBuscar = browser.$('#BtnConsultar')
    await btnBuscar.waitForClickable()
    await btnBuscar.click()
    await btnBuscar.waitForClickable()

    const rows = await browser.$('#DvResultado').$$('tr').getElements()

    await browser.pause(1_500)

    const polizas: ScrappedAnasegurosPoliza[] = []


    for (const row of rows) {
        // Escrapear la fila de la poliza
        const [
            fechaEmision,
            vigenciaInicio,
            vigenciaFin,
            numero_poliza,
            endoso,
            nombreAsegurado,
            vehiculoAsegurado,
            modelo,
            serie,
            placa,
            cobertura,
            formaPago,
            metodoPago,
            primaTotal,
            origen,
            motivoCancelacion,
            acciones,
        ] = await row.$$('td').getElements()


        const poliza: ScrappedAnasegurosPoliza = {
            agente,
            fechaEmision: (await fechaEmision?.getText())?.trim() ?? '',
            vigenciaInicio: (await vigenciaInicio?.getText())?.trim() ?? '',
            vigenciaFin: (await vigenciaFin?.getText())?.trim() ?? '',
            poliza: (await numero_poliza?.getText())?.trim() ?? '',
            endoso: (await endoso?.getText())?.trim() ?? '',
            nombreAsegurado: (await nombreAsegurado?.getText())?.trim() ?? '',
            vehiculoAsegurado: (await vehiculoAsegurado?.getText())?.trim() ?? '',
            modelo: (await modelo?.getText())?.trim() ?? '',
            serie: (await serie?.getText())?.trim() ?? '',
            placa: (await placa?.getText())?.trim() ?? '',
            cobertura: (await cobertura?.getText())?.trim() ?? '',
            formaPago: (await formaPago?.getText())?.trim() ?? '',
            metodoPago: (await metodoPago?.getText())?.trim() ?? '',
            primaTotal: (await primaTotal?.getText())?.trim() ?? '',
            origen: (await origen?.getText())?.trim() ?? '',
            motivoCancelacion: (await motivoCancelacion?.getText())?.trim() ?? '',
            acciones: (await acciones?.getText())?.trim() ?? '',
            aseguradoId: null,
            link: '',
            recibos: [],
            dataFromDailyScrapper: dataFromDailyScrapper ?? {},
            siniestros: [],
        }

        // Si la poliza no tiene fecha de emision, o si la fecha de emision es un texto que indica que es un agente o una lista, o si la fecha de emision es un texto que indica que es una fecha, entonces se ignora
        if (!poliza.fechaEmision ||
            poliza.fechaEmision.toLowerCase()?.startsWith('agente') ||
            poliza.fechaEmision.toLowerCase()?.startsWith('list') ||
            poliza.fechaEmision.toLowerCase()?.startsWith('fec')
        ) {
            continue
        }

        // Buscar la poliza en la base de datos
        const [existingPoliza] = await pgDb.select().from(tblPolizas).where(and(
            eq(tblPolizas.saasId, saasId),
            eq(tblPolizas.companyId, 'anaseguros'),
            eq(tblPolizas.numeroPoliza, poliza.poliza),
            eq(tblPolizas.endoso, poliza.endoso),
        ))


        // Actualizar los recibos de la poliza
        const recibosBtn = acciones.$('span[title="RECIBO/FACTURA"]')
        const shouldClickRecibos = await browser.waitUntil(async () => {
            const isDisplayed = await recibosBtn.isDisplayed()
            const isClickable = await recibosBtn.isClickable()
            const hasIconBlank = (await recibosBtn.getAttribute('class'))?.includes('icon-blank')

            return isDisplayed && isClickable && !hasIconBlank
        }, { timeout: 500 }).catch(() => {
            return false
        })
        if (shouldClickRecibos) {
            console.log('Clicking recibos', poliza.poliza, poliza.endoso)
            await recibosBtn.click()
            await browser.$('#BtnAjustarDF').waitForClickable({ timeout: 120_000 })
            const recibosToScrape = await browser.$('#FrmResultado').$$('tr').getElements()
            for (let idx = 0; idx < recibosToScrape.length; idx++) {
                const row = recibosToScrape[idx];
                const [
                    no,
                    inicioVigencia,
                    cantidad,
                    recibo,
                    estatusPago,
                    fechaAplicacion,
                    fechaPago,
                    estatusRecibo,
                ] = await row.$$('td').getElements()
                const reciboActual: ScrappedAnasegurosRecibo = {
                    no: (await no?.getText())?.trim() ?? '',
                    inicioVigencia: (await inicioVigencia?.getText())?.trim() ?? '',
                    cantidad: (await cantidad?.getText())?.trim() ?? '',
                    recibo: (await recibo?.getText())?.trim() ?? '',
                    estatusPago: (await estatusPago?.getText())?.trim() ?? '',
                    fechaAplicacion: (await fechaAplicacion?.getText())?.trim() ?? '',
                    fechaPago: (await fechaPago?.getText())?.trim() ?? '',
                    estatusRecibo: (await estatusRecibo?.getText())?.trim() ?? '',
                }

                if (!reciboActual.no
                    || reciboActual.no.toLowerCase()?.startsWith('no')) {
                    // Recibos ignorados
                } else {
                    // Si el recibo tiene un numero, entonces se agrega al array de recibos
                    poliza.recibos.push(reciboActual)
                }

            }

            const cancelarButton = await browser.$('#FrmBotones').$('input[name="BtnCancelar"]').getElement()
            await cancelarButton.waitForClickable()
            await cancelarButton.click()
            await browser.pause(500)
        }

        // Si la poliza no existe en la base de datos, se obtiene el link de descarga de la poliza / endoso
        if (!existingPoliza) {
            console.log('No se encontró la poliza en la base de datos')
            const impresionButton = await acciones.$('span[title="IMPRESION"]').getElement()
            if (!(await impresionButton.getAttribute('class'))?.includes('icon-blank')) {
                await impresionButton.waitForClickable()
                await impresionButton.click()
                await browser.waitUntil(async () => {
                    const isDisplayed = await browser.$('#FrmResultado').isDisplayed()
                    const hasAnATag = await browser.$('#FrmResultado').$('a').isExisting()
                    return isDisplayed && hasAnATag
                }, { timeout: 20_000 })
                await browser.pause(1_500)
                const resultadoDiv = await browser.$('#FrmResultado').getElement()
                const link = resultadoDiv.$('a')
                const href = await link.getAttribute('href')


                poliza.link = href ?? ''
                await browser.execute(() => {
                    // @ts-ignore
                    $("#FrmAcciones").dialog("close")
                })
            }
        }

        // Obtener los siniestros de la póliza
        const siniestrosBtn = acciones.$('span[title*="SINIESTRO"]')
        const shouldClickSiniestros = await browser.waitUntil(async () => {
            const isDisplayed = await siniestrosBtn.isDisplayed()
            const isClickable = await siniestrosBtn.isClickable()
            const hasIconBlank = (await siniestrosBtn.getAttribute('class'))?.includes('icon-blank')

            return isDisplayed && isClickable && !hasIconBlank
        }, { timeout: 500 }).catch(() => {
            return false
        })

        if (shouldClickSiniestros) {
            console.log('Clicking siniestros', poliza.poliza, poliza.endoso)
            await siniestrosBtn.click()
            await browser.pause(500)
            await browser.waitUntil(async () => {
                const isDisplayed = await browser.$('#FrmResultado').isDisplayed()
                const hasRows = (await browser.$('#FrmResultado').$$('tr').getElements()).length > 1
                return isDisplayed && hasRows
            }, { timeout: 120_000 })
            await browser.pause(500)
            // Ejercicio 	Siniestro 	Endoso 	Inciso 	Fecha Ocurrido
            // Fecha Reclamo 	Detalle 	Est 	Cobertura 	Monto Est 	Pagos 
            let ejercicio = ''
            let siniestro = ''
            let endoso = ''
            let inciso = ''
            let fechaOcurrido = ''
            let fechaReclamo = ''
            let detalle = ''
            const siniestrosToScrape = await browser.$('#FrmResultado').$$('tr').getElements()
            for (let idx = 0; idx < siniestrosToScrape.length; idx++) {
                const row = siniestrosToScrape[idx];
                const [
                    _ejercicio,
                    _siniestro,
                    _endoso,
                    _inciso,
                    _fechaOcurrido,
                    _fechaReclamo,
                    _detalle,
                    estimado,
                    cobertura,
                    montoEst,
                    pagos,
                ] = await row.$$('td').getElements()


                ejercicio = (await _ejercicio?.getText())?.trim() || ejercicio
                siniestro = (await _siniestro?.getText())?.trim() || siniestro
                endoso = (await _endoso?.getText())?.trim() || endoso
                inciso = (await _inciso?.getText())?.trim() || inciso
                fechaOcurrido = (await _fechaOcurrido?.getText())?.trim() || fechaOcurrido
                fechaReclamo = (await _fechaReclamo?.getText())?.trim() || fechaReclamo
                detalle = (await _detalle?.getText())?.trim() || detalle


                const siniestroActual: ScrappedAnasegurosSiniestro = {
                    ejercicio,
                    siniestro,
                    endoso,
                    inciso,
                    fechaOcurrido,
                    fechaReclamo,
                    detalle,
                    estimado: (await estimado?.getText())?.trim() ?? '',
                    cobertura: (await cobertura?.getText())?.trim() ?? '',
                    montoEst: (await montoEst?.getText())?.trim() ?? '',
                    pagos: (await pagos?.getText())?.trim() ?? '',
                }

                if (
                    siniestroActual.ejercicio.toLowerCase()?.startsWith('ejer') ||
                    siniestroActual.ejercicio.toLowerCase()?.startsWith('siniest') ||
                    siniestroActual.estimado === '*'
                ) {
                    continue
                }

                poliza.siniestros.push(siniestroActual)
            }


            const cancelarButton = await browser.$('#FrmBotones').$('input[name="BtnCancelar"]').getElement()
            await cancelarButton.waitForClickable()
            await cancelarButton.click()
            await browser.pause(500)

        }

        await browser.pause(500)
        polizas.push(poliza)
    }

    // Obtener el número de asegurado en el reporte de renovacion
    await browser.url('https://server.anaseguros.com.mx/ananet/pages/Reportes.aspx')
    await browser.pause(2000)

    const btn = browser.$('[nidreporte="13"]')
    await btn.waitForExist()
    await btn.waitForClickable()
    await btn.click()

    await browser.pause(2000)

    const selectAnio = await browser.$('label=AÑO:').nextElement().getElement()
    const selectMes = await browser.$('label=MES:').nextElement().getElement()

    const [_, month, year] = polizas[polizas.length - 1].vigenciaFin.split('/')

    await selectAnio.selectByVisibleText(year)

    await selectMes.waitForClickable()
    await selectMes.selectByAttribute('value', Number(month).toString())

    await browser.pause(500)
    const btnGenerar = browser.$('#BtnConsultar')
    await btnGenerar.waitForExist()
    await btnGenerar.waitForClickable().catch(() => {
        throw new Error("No se pudo hacer click en el boton de generar")
    })
    await btnGenerar.click()
    await btnGenerar.waitForClickable()
    await browser.pause(2_000)


    let aseguradoId: string | null = null
    const rowsRenovacion = await browser.$('#TblExport').$$('tr').getElements()
    for (const row of rowsRenovacion) {
        const [
            _,
            noPoliza,
            idAsegurado,
        ] = await row.$$('td').getElements()
        if (await noPoliza?.getText() === polizas[0].poliza) {
            aseguradoId = await idAsegurado?.getText()
        }

    }

    for (const poliza of polizas) {
        poliza.aseguradoId = aseguradoId

    }

    setImmediate(async () => {
        console.log('Se va a procesar la poliza', numero_poliza)
        await processScrapped(polizas, saasId)
    })
}
