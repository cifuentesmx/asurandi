import { PolizaSiniestrada } from "@asurandi/types"

export async function getQualitasPolizasSiniestradas(start: string, end: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizaSiniestrada[]> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-siniestradas`)
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
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No se encontraron pólizas con siniestros').length
        const found = await browser.$$('#tableSiniestros_paginate').length
        return found > 0 || none > 0
    })


    const polizas: PolizaSiniestrada[] = []
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

    const ul = browser.$('#tableSiniestros_paginate > ul')
    const scrappedPages: Set<string> = new Set()

    while (pending) {
        const tbody = await browser.$('table#tableSiniestros > tbody').getElement()

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
                numSiniestro,
                ejercicio,
                reporte,
                estimacion,
                fecha,
            ] = await row.$$('td').getElements()
            polizas.push({
                company: 'qualitas',
                poliza: await poliza.getText(),
                numSiniestro: await numSiniestro.getText(),
                ejercicio: await ejercicio.getText(),
                reporte: await reporte.getText(),
                estimacion: await estimacion.getText(),
                fecha: await fecha.getText(),

            })
        })

        const next = ul.$('li#tableSiniestros_next > a')
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

