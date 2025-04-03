import { PolizasRenovadas } from "@asurandi/types"

export async function getQualitasPolizasRenovadas(start: string, end: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizasRenovadas> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-renovadas`)
    await browser.$('#date1').waitForClickable()
    await browser.$('#date2').waitForClickable()
    const inputF1 = browser.$('#date1')
    const inputF2 = browser.$('#date2')
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
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No existen pólizas').length
        const found = await browser.$$('#renovacionesTable_paginate').length
        return found > 0 || none > 0
    })


    const polizas: PolizasRenovadas = []
    if (none > 0) return polizas

    const ul = browser.$('#renovacionesTable_paginate > ul')
    const scrappedPages: string[] = []
    const tbody = await browser.$('table#renovacionesTable > tbody').getElement()

    const lis = await ul.$$('li').getElements()
    for (let i = 0; i < lis.length; i++) {
        const id = await ul.$('li.active>a').getAttribute('data-dt-idx')
        const isNext = await ul.$('li.active>a').getAttribute('id')
        if (id === '0' || isNext === 'renovacionesTable_next') continue
        if (!scrappedPages.includes(id)) {
            scrappedPages.push(id)
            await browser.pause(5000)
            await tbody.$$('tr').forEach(async row => {
                const [
                    polizaAnterior,
                    fechaVencimiento,
                    datos,
                    asegurado,
                    planPago,
                    polizaRenovada,
                ] = await row.$$('td').getElements()
                polizas.push({
                    polizaAnterior: await polizaAnterior.getText(),
                    fechaVencimiento: await fechaVencimiento.getText(),
                    datos: await datos.getText(),
                    asegurado: await asegurado.getText(),
                    planPago: await planPago.getText(),
                    polizaRenovada: await polizaRenovada.getText(),
                })
            })

            const next = ul.$('li#renovacionesTable_next > a')
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