type PolizasEmitidas = Set<{
    poliza: string
    ramo: string
    endoso: string
    fechaEmision: string
    inicioVigencia: string
    moneda: string
    primaRecibo: string
    tipoMovimiento: string
}>
export async function getQualitasPolizasEmitidas(start: string, end: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizasEmitidas> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-emitidas`)
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
    await browser.pause(3500)
    let none: number = 0
    await browser.waitUntil(async () => {
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No se encontraron pólizas emitidas').length
        const found = await browser.$$('li#tablePolizaEmitida_next').length
        return found > 0 || none > 0
    })


    const polizas: PolizasEmitidas = new Set()
    if (none > 0) return polizas

    const ul = browser.$('#tablePolizaEmitida_paginate > ul')
    const scrappedPages: string[] = []
    const tbody = await browser.$('table#tablePolizaEmitida > tbody').getElement()

    const lis = await ul.$$('li').getElements()
    for (let i = 0; i < lis.length; i++) {
        const id = await ul.$('li.active>a').getAttribute('data-dt-idx')
        const isNext = await ul.$('li.active>a').getAttribute('id')
        if (id === '0' || isNext === 'tablePolizaEmitida_next') continue
        if (!scrappedPages.includes(id)) {
            scrappedPages.push(id)
            await browser.pause(5000)
            await tbody.$$('tr').forEach(async row => {
                const [poliza,
                    ramo,
                    endoso,
                    fechaEmision,
                    inicioVigencia,
                    moneda,
                    primaRecibo,
                    tipoMovimiento,
                ] = await row.$$('td').getElements()
                polizas.add({
                    poliza: await poliza.getText(),
                    ramo: await ramo.getText(),
                    endoso: await endoso.getText(),
                    fechaEmision: await fechaEmision.getText(),
                    inicioVigencia: await inicioVigencia.getText(),
                    moneda: await moneda.getText(),
                    primaRecibo: await primaRecibo.getText(),
                    tipoMovimiento: await tipoMovimiento.getText(),
                })
            })

            const next = ul.$('li#tablePolizaEmitida_next > a')
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