import { PolizaNoRenovada } from "@asurandi/types"

export async function getQualitasPolizasNoRenovadas(start: string, end: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizaNoRenovada[]> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-no-renovadas`)
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


    const polizas: PolizaNoRenovada[] = []
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


    const ul = browser.$('#renovacionesTable_paginate > ul')
    const scrappedPages: Set<string> = new Set()
    const tbody = await browser.$('table#renovacionesTable > tbody').getElement()

    while (pending) {
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
                primaTotal,
                asegurado,
                numeroSerie,
                fechaVencimiento,
                causaNoRenovación,
            ] = await row.$$('td').getElements()
            polizas.push({
                company: 'qualitas',
                poliza: (await poliza.getText())?.replace('\n', '')?.trim() ?? undefined,
                primaTotal: (await primaTotal.getText())?.replace('\n', '')?.trim() ?? undefined,
                asegurado: (await asegurado.getText())?.replace('\n', '')?.trim() ?? undefined,
                numeroSerie: (await numeroSerie.getText())?.replace('\n', '')?.trim() ?? undefined,
                fechaVencimiento: (await fechaVencimiento.getText())?.replace('\n', '')?.trim() ?? undefined,
                causaNoRenovación: (await causaNoRenovación.getText())?.replace('\n', '')?.trim() ?? undefined,
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

    return polizas
}
