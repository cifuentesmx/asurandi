import { QualitasScrappedPoliza } from '@asurandi/types';
import { scrapeEstatus } from './scrapeEstatus.js';
import { scrapeRecibos } from './scrapeRecibos.js';
import { scrapeResumen } from './scrapeResumen.js';
import { scrapeSiniestros } from './scrapeSiniestros.js';

export async function scrapePoliza(numero_poliza: string, browser: WebdriverIO.Browser) {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/consulta-de-polizas/-/consulta/directa?poliza=${numero_poliza}`)

    await browser.$('#accordion').waitForClickable().catch(async (error) => {
        await browser.pause(150)
        if (await browser.$('*=otro agente').isDisplayed()) throw new Error(`La póliza ${numero_poliza} pertence a otro agente`);
        if (await browser.$('*=poliza a afectar').isDisplayed()) throw new Error(`No existe el número de poliza a afectar: ${numero_poliza}`);
        else throw error;
    })
    const poliza: QualitasScrappedPoliza = {}
    await browser.$$('.card-header').forEach(async el => {
        const title = await el.$('p').getText()
        switch (title) {
            case 'Resumen de póliza':
                poliza.resumen = await scrapeResumen(numero_poliza, el)
                break;
            case 'Estatus de póliza':
                poliza.estatus = await scrapeEstatus(el)
                break;
            case 'Recibos de póliza':
                poliza.recibos = await scrapeRecibos(el)
                break;
            case 'Siniestros':
                poliza.siniestros = await scrapeSiniestros(el, browser)
                break;
            case 'Avisos de cobro y renovación de la póliza':
                break;
            case 'Envió de SMS del número de Póliza':
                break;

            default:
                break;
        }
    })

    return poliza
}

