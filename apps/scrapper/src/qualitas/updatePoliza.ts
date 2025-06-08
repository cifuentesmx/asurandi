import { ScrappedPolizaEvent } from '@asurandi/types';
import { scrapeFlotilla } from "./flotilla/scrapeFlotilla.js"
import { scrapePoliza } from "./poliza/scrapePoliza.js"

export async function updatePoliza(numero_poliza: string, browser: WebdriverIO.Browser, saasId: string)
    : Promise<ScrappedPolizaEvent> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/consulta-de-flotas?query=${numero_poliza}`)
    await browser.$('#divSeA').waitForClickable().catch(async () => {

        browser.pause(150)
        const button = browser.$('button*=Salir')
        if (await button.isDisplayed()) {
            await button.waitForClickable()
            await button.click()
            browser.pause(150)
        }
    })
    const search = browser.$('#busquedaPolizas')
    await search.waitForDisplayed()
    await search.setValue(numero_poliza)
    await browser.pause(300)
    await browser.waitUntil(async () => {
        const found = await browser.$$('*=Mostrando 1 a 1 de 1 pólizas').length
        return await browser.$('td*=No se encontraron').isDisplayed() || found === 1
    })




    if (await browser.$('td*=No se encontraron').isDisplayed()) {
        const scrapped: ScrappedPolizaEvent = {
            company: 'qualitas',
            saasId,
            event: 'scrape.poliza',
            type: 'individual',
            payload: await scrapePoliza(numero_poliza, browser)


        }
        return scrapped

    } else if (await browser.$$('*=Mostrando 1 a 1 de 1 pólizas').length === 1) {
        const scrapped: ScrappedPolizaEvent = {
            company: 'qualitas',
            event: 'scrape.poliza',
            saasId,
            type: 'fleet',
            payload: await scrapeFlotilla(numero_poliza, browser)

        }
        return scrapped
    }
    throw new Error('No se pudo encontrar cómo procesar la poliza solicitada')
}

