import { PolizasPagadas } from "@asurandi/types"

export async function getQualitasPolizasPagadas(start: string, end: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizasPagadas> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-pagadas`)
    await browser.$('#fecha1').waitForClickable()
    await browser.$('#fecha2').waitForClickable()
    const inputF1 = browser.$('#fecha1')
    const inputF2 = browser.$('#fecha2')
    await inputF1.waitForDisplayed()
    await inputF1.setValue(start)
    await browser.pause(350)
    await browser.keys("\uE007")
    await browser.pause(150)

    await inputF2.waitForDisplayed()
    await inputF2.setValue(end)
    await browser.pause(350)
    await browser.keys("\uE007")
    await browser.pause(350)

    await browser.keys("\uE007")
    await browser.pause(10000)
    let none: number = 0
    await browser.waitUntil(async () => {
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No se encontraron pólizas pagadas').length
        const found = await browser.$$('#tablePolizasPagadas_paginate').length
        return found > 0 || none > 0
    })


    const polizas: PolizasPagadas = []
    if (none > 0) return polizas

    const ul = browser.$('#tablePolizasPagadas_paginate > ul')
    const scrappedPages: string[] = []
    const tbody = await browser.$('table#tablePolizasPagadas > tbody').getElement()

    const lis = await ul.$$('li').getElements()
    for (let i = 0; i < lis.length; i++) {
        const id = await ul.$('li.active>a').getAttribute('data-dt-idx')
        const isNext = await ul.$('li.active>a').getAttribute('id')
        if (id === '0' || isNext === 'tablePolizasPagadas_next') continue
        if (!scrappedPages.includes(id)) {
            scrappedPages.push(id)
            await browser.pause(5000)
            await tbody.$$('tr').forEach(async row => {
                const [
                    poliza,
                    ramo,
                    endoso,
                    recibo,
                    serie,
                    fechaPago,
                    asegurado,
                    moneda,
                    primaRecibo,

                ] = await row.$$('td').getElements()
                polizas.push({
                    poliza: await poliza.getText(),
                    ramo: await ramo.getText(),
                    endoso: await endoso.getText(),
                    recibo: await recibo.getText(),
                    serie: await serie.getText(),
                    fechaPago: await fechaPago.getText(),
                    asegurado: await asegurado.getText(),
                    moneda: await moneda.getText(),
                    primaRecibo: await primaRecibo.getText(),

                })
            })

            const next = ul.$('li#tablePolizasPagadas_next > a')
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