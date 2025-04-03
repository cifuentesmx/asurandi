import { QualitasScrappedFlota, QualitasScrappedFlotaInciso } from '@asurandi/types';
import { scrapeSiniestros } from '../poliza/scrapeSiniestros.js';
export async function scrapeFlotilla(numero_poliza: string, browser: WebdriverIO.Browser): Promise<QualitasScrappedFlota> {


    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/consulta-de-flotas/-/detalle/poliza?numPoliza=${numero_poliza}`)
    const flotilla: QualitasScrappedFlota = {
        resumen: [],
        incisos: []
    }
    await browser.$('#accordionIncisosTable').waitForClickable()
    const parent = browser.$('p=Resumen de póliza').parentElement().parentElement().parentElement()

    const resumen: { key: string, value: string }[] = []
    await parent.$$('div').forEach(async div => {
        if (await div.$$('p').length === 2) {
            const [keyP, valueP] = await div.$$('p').getElements()
            resumen.push({
                key: (await keyP?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                value: (await valueP?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
            })
        }
    })

    flotilla.resumen = resumen

    const p = await browser.$('p=Listado de incisos').getElement()

    await p.waitForClickable()
    await p.click()

    const tbody = browser.$('#tablaIncisos').$('tbody')

    const ul = browser.$('#tablaIncisos_paginate')
    const lis = await ul.$$('li').getElements()
    const scrappedIncisos: string[] = []

    await browser.pause(5000)

    // Obtener la tabla de los incisos
    for (let i = 0; i < lis.length; i++) {
        const id = await ul.$('li.active > a').getAttribute('data-dt-idx')
        if (!scrappedIncisos.includes(id)) {
            scrappedIncisos.push(id)

            const rows = await tbody.$$('tr').getElements()
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const [
                    inciso,
                    numero_economico,
                    vigencia,
                    endoso,
                    descripcion,
                    cobertura,
                    serie,
                    placas,
                    estatus,
                    prima_neta,
                ] = await row.$$('td').getElements()

                const data: QualitasScrappedFlotaInciso = {
                    inciso: (await inciso?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    numero_economico: (await numero_economico?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    vigencia: (await vigencia?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    endoso: (await endoso?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    descripcion: (await descripcion?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    cobertura: (await cobertura?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    serie: (await serie?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    placas: (await placas?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    estatus: (await estatus?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    prima_neta: (await prima_neta?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    polizaInciso: {
                        serialData: [],
                        coberturas: [],
                        statusPoliza: [],
                        recibos: [],
                        siniestros: []
                    }
                }
                flotilla.incisos.push(data)

            }

            const next = ul.$('li#tablaIncisos_next > a')
            await next.waitForClickable()
            await next.click()
            await browser.pause(5000)
        }
    }

    // obtener los datos de los incisos
    for (let i = 0; i < flotilla.incisos.length; i++) {
        const inciso = flotilla.incisos[i];

        await browser.url(`https://agentes360.qualitas.com.mx/group/guest/consulta-de-polizas/-/consulta/directa?poliza=${numero_poliza}&inciso=${inciso.inciso}&endoso=${inciso.endoso}&flota=1`)
        const accordion = browser.$('#accordion')
        await accordion.waitForClickable()

        const sections = await browser.$$('#accordion > div').getElements()
        sections[0].waitForClickable()
        sections[0].click()


        const resumen = browser.$('p=Resumen de póliza').parentElement().parentElement()
        await resumen.$('p=Resumen de póliza').waitForDisplayed()

        // Obtener datos serializados del resumen
        await browser.pause(1_000)
        await resumen.$$('#data-policy').forEach(async div => {

            if (await div.$$('div > p').length > 0) {


                const sections = await div.$$('div').getElements()
                await sections.forEach(async box => {
                    const ps = await box.$$('p').getElements()
                    if (ps.length === 2) {
                        const [keyP, valueP] = ps
                        const key = (await keyP?.getText())?.replace('\n', ' ')?.trim() ?? '__ERROR__'
                        if (key && key !== '__ERROR__' && key !== '') {
                            flotilla.incisos[i].polizaInciso.serialData.push({
                                key,
                                value: (await valueP?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                            })
                        }
                    }

                    const divsL1 = await box.$$('div').getElements()
                    for (let idx = 0; idx < divsL1.length; idx++) {
                        const element = divsL1[idx];
                        const ps = await element.$$('p').getElements()
                        if (ps.length === 2) {
                            const [keyP, valueP] = ps
                            const key = (await keyP?.getText())?.replace('\n', ' ')?.trim() ?? '__ERROR__'
                            if (key && key !== '__ERROR__' && key !== '') {
                                flotilla.incisos[i].polizaInciso.serialData.push({
                                    key,
                                    value: (await valueP?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                                })
                            }
                        }
                    }
                })

            }

        });

        // Si el resumen tiene una tabla "DEBE" ser de las coberturas???
        await resumen.$('#tableCobertura').$$('tr').forEach(async row => {

            const [sumaAseguradaTd, deducibleTd, primaTd] = await row.$$('td').getElements()
            const [coberturaTd] = await row.$$('th').getElements()
            if (sumaAseguradaTd)
                flotilla.incisos[i].polizaInciso.coberturas.push({
                    cobertura: (await coberturaTd?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    sumaAsegurada: (await sumaAseguradaTd?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    deducible: (await deducibleTd?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    prima: (await primaTd?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                })

        })


        // Obtener estatus de la poliza:
        if (i === 0) {
            if (await browser.$$('p=Estatus de póliza').length > 0) {
                const statusPoliza = browser.$('p=Estatus de póliza').parentElement().parentElement()
                await statusPoliza.waitForClickable()
                await statusPoliza.click()

                await statusPoliza.$$('tbody > tr').forEach(async row => {
                    const [
                        fecha_vencimiento,
                        numero_recibo,
                        remesa,
                        fecha_pago,
                        importe,
                        estado,
                        tipo_movimiento,
                    ] = await row.$$('td').getElements()

                    const [endoso] = await row.$$('th').getElements()

                    await browser.pause(500)

                    const data = {
                        endoso: (await endoso.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        fecha_vencimiento: (await fecha_vencimiento.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        num_recibo: (await numero_recibo.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        remesa: (await remesa.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        fecha_pago: (await fecha_pago.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        importe: (await importe.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        estado: (await estado.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        tipo_movimiento: (await tipo_movimiento.$('div')?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    }

                    flotilla.incisos[i].polizaInciso.statusPoliza.push(data)

                })

            }



            // Obtener Recibos de la poliza:
            if (await browser.$$('p=Recibos de póliza').length > 0) {
                const recibos = browser.$('p=Recibos de póliza').parentElement().parentElement()
                await recibos.waitForClickable()
                await recibos.click()

                await recibos.$$('tbody > tr').forEach(async row => {
                    const [
                        serie,
                        vigencia_recibo,
                        folio,
                        serie_emision,
                        importe_recibo,
                        estado,
                    ] = await row.$$('td').getElements()

                    const [numero_recibo] = await row.$$('th').getElements()

                    await browser.pause(500)

                    const data = {
                        numero_recibo: (await numero_recibo?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        serie: (await serie?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        vigencia: (await vigencia_recibo?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        folio: (await folio?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        serie_emision: (await serie_emision?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        importe_total: (await importe_recibo?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                        estado: (await estado?.getText())?.replace('\n', ' ').trim() ?? '__ERROR__',
                    }

                    flotilla.incisos[i].polizaInciso.recibos.push(data)

                })
            }

        }

        // Obtener siniestros
        if (await browser.$$('p=Siniestros').length > 0) {

            const parent = browser.$('p=Siniestros').parentElement().parentElement()
            await parent.waitForClickable()
            await parent.click()

            const el = await (await browser.$$('p=Siniestros').getElements())[0].parentElement().getElement()

            const reportes = await scrapeSiniestros(el, browser)
            flotilla.incisos[i].polizaInciso.siniestros = reportes

        }

    }
    return flotilla
}