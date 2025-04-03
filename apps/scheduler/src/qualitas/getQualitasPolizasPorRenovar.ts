import { PolizasPorRenovar } from "@asurandi/types";

export async function getQualitasPolizasPorRenovar(browser: WebdriverIO.Browser, saasId: string)
    : Promise<PolizasPorRenovar> {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 38);

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    ;

    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/polizas-por-renovar`)
    await browser.$('#date1').waitForClickable()
    await browser.$('#date2').waitForClickable()
    const inputF1 = browser.$('#date1')
    const inputF2 = browser.$('#date2')
    await inputF1.waitForDisplayed()
    await inputF1.setValue(formatDate(today))
    await browser.pause(350)
    await browser.keys("\uE007")
    await browser.pause(150)

    await inputF2.waitForDisplayed()
    await inputF2.setValue(formatDate(futureDate))
    await browser.pause(350)
    await browser.keys("\uE007")
    await browser.pause(350)

    await browser.keys("\uE007")
    await browser.pause(10000)
    let none: number = 0
    await browser.waitUntil(async () => {
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No existen renovaciones en el periodo seleccionado').length
        const found = await browser.$$('#renovacionesTable_paginate').length
        return found > 0 || none > 0
    }, { timeout: 240000 })


    const polizas: PolizasPorRenovar = []
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
                    checked,
                    poliza,
                    fechaVencimiento,
                    automovil,
                    asegurado,
                    planPago,
                    descuentoCartera,
                    descuentoBuenaConducta,
                    primaTotalActualAnterior,
                    estatus,
                    editar,
                    causaNoRenovacion,
                ] = await row.$$('td').getElements()
                polizas.push({
                    checked: await checked.getText(),
                    poliza: await poliza.getText(),
                    fechaVencimiento: await fechaVencimiento.getText(),
                    automovil: await automovil.getText(),
                    asegurado: await asegurado.getText(),
                    planPago: await planPago.getText(),
                    descuentoCartera: await descuentoCartera.getText(),
                    descuentoBuenaConducta: await descuentoBuenaConducta.getText(),
                    primaTotalActualAnterior: await primaTotalActualAnterior.getText(),
                    estatus: await estatus.getText(),
                    editar: await editar.getText(),
                    causaNoRenovacion: await causaNoRenovacion.getText(),

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