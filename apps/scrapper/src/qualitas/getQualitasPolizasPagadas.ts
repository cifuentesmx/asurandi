import { PolizaPagada } from "@asurandi/types"

export async function getQualitasPolizasPagadas(start: string, end: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizaPagada[]> {
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


    const polizas: PolizaPagada[] = []
    if (none > 0) return polizas

    let pending = true

    const select = browser.$('select.form-control')
    await select.waitForClickable()
    await select.click()
    await browser.pause(1000)
    const options = await select.$$('option').getElements()
    const lastOption = options[options.length - 1]
    await lastOption.click()
    await browser.pause(1000)



    const ul = browser.$('#tablePolizasPagadas_paginate > ul')
    const scrappedPages: Set<string> = new Set()

    while (pending) {
        const tbody = await browser.$('table#tablePolizasPagadas > tbody').getElement()

        const id = await ul.$('li.active>a').getAttribute('data-dt-idx')
        if (scrappedPages.has(id)) {
            pending = false
            break
        }
        scrappedPages.add(id)
        await browser.pause(1500)
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
                company: 'qualitas',
                poliza: (await poliza.getText()).replace('\n', '')?.trim() ?? '',
                ramo: (await ramo.getText()).replace('\n', '')?.trim() ?? '',
                endoso: (await endoso.getText()).replace('\n', '')?.trim() ?? '',
                recibo: (await recibo.getText()).replace('\n', '')?.trim() ?? '',
                serie: (await serie.getText()).replace('\n', '')?.trim() ?? '',
                fechaPago: (await fechaPago.getText()).replace('\n', '')?.trim() ?? '',
                asegurado: (await asegurado.getText()).replace('\n', '')?.trim() ?? '',
                moneda: (await moneda.getText()).replace('\n', '')?.trim() ?? '',
                primaRecibo: (await primaRecibo.getText()).replace('\n', '')?.trim() ?? '',

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
    return polizas
}
