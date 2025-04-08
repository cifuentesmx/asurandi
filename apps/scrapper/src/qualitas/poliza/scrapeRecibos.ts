import { ScrappedPolizaRecibos } from '@asurandi/types';
export async function scrapeRecibos(element: WebdriverIO.Element): Promise<ScrappedPolizaRecibos> {
    const parent = element.parentElement()
    await element.waitUntil(async () => {
        return await element.isDisplayed()
    })
    await element.waitForClickable()
    await element.click()
    const recibos: ScrappedPolizaRecibos = []
    const table = parent.$('table')
    const body = table.$('tbody')
    await body.$$('tr').forEach(async row => {
        const numero_reciboTd = row.$('th')
        const [
            serieTd,
            vigenciaTd,
            folioTd,
            serie_emisionTd,
            importe_totalTd,
            estadoTd,
        ] = await row.$$('td').getElements()
        if (!estadoTd) return
        recibos.push({
            numero_recibo: (await numero_reciboTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            serie: (await serieTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            vigencia: (await vigenciaTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            folio: (await folioTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            serie_emision: (await serie_emisionTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            importe_total: (await importe_totalTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            estado: (await estadoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
        }
        )

    })

    return recibos

}


