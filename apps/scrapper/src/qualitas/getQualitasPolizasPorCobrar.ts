import { getNumberString } from "../database/qualitas/getNumber.js";
import { PolizaPorCobrar } from "@asurandi/types";

export async function getQualitasPolizasPorCobrar(browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizaPorCobrar[]> {

    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-por-cobrar`)

    let none: number = 0
    await browser.waitUntil(async () => {
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No existen renovaciones en el periodo seleccionado').length
        const found = await browser.$$('#tableCobranza_paginate').length
        return found > 0 || none > 0
    }, { timeout: 240000 })


    const polizas: PolizaPorCobrar[] = []
    if (none > 0) return polizas

    const ul = browser.$('#tableCobranza_paginate > ul')
    const scrappedPages: string[] = []
    const tbody = await browser.$('table#tableCobranza > tbody').getElement()

    const lis = await ul.$$('li').getElements()
    for (let i = 0; i < lis.length; i++) {
        const id = await ul.$('li.active>a').getAttribute('data-dt-idx')
        const isNext = await ul.$('li.active>a').getAttribute('id')
        if (id === '0' || isNext === 'tableCobranza_next') continue
        if (!scrappedPages.includes(id)) {
            scrappedPages.push(id)
            await browser.pause(5000)
            await tbody.$$('tr').forEach(async row => {
                const [
                    poliza,
                    ramo,
                    endoso,
                    fechaVencimiento,
                    periodoGracia,
                    formaPago,
                    asegurado,
                    serie,
                    numeroRecibo,
                    moneda,
                    importe,
                    actividad,

                ] = await row.$$('td').getElements()
                polizas.push({
                    company: 'qualitas',
                    poliza: await poliza.getText(),
                    ramo: await ramo.getText(),
                    endoso: await endoso.getText(),
                    fechaVencimiento: await fechaVencimiento.getText(),
                    periodoGracia: await periodoGracia.getText(),
                    formaPago: await formaPago.getText(),
                    asegurado: await asegurado.getText(),
                    serie: await serie.getText(),
                    numeroRecibo: await numeroRecibo.getText(),
                    moneda: await moneda.getText(),
                    importe: getNumberString(await importe.getText()) ?? '0',
                    actividad: await actividad.getText(),

                })
            })

            const next = ul.$('li#tableCobranza_next > a')
            await browser.pause(150)
            await next.click().then(async () => {
                await browser.pause(500)
            }).catch(async () => {
                console.log('Please refactor waiting is pointless')
                await browser.pause(350)
            })
            await browser.pause(1500)
        }

    }

    return polizas
}