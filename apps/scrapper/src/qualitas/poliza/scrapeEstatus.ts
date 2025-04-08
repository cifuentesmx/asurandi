import { ScrappedPolizaEstatusEndoso, ScrappedPolizaEstatus } from "@asurandi/types"

export async function scrapeEstatus(element: WebdriverIO.Element): Promise<ScrappedPolizaEstatus> {
    const parent = element.parentElement()
    await element.waitUntil(async () => {
        return await element.isDisplayed()
    })
    await element.waitForClickable()
    await element.click()
    const endosos: ScrappedPolizaEstatusEndoso[] = []
    const table = parent.$('p=Endoso').parentElement().parentElement().parentElement().parentElement()
    const body = table.$('tbody')
    await body.$$('tr').forEach(async row => {
        const endosoTd = row.$('th')
        const [
            fecha_vencimientoTd,
            num_reciboTd,
            remesaTd,
            fecha_pagoTd,
            importeTd,
            estadoTd,
            tipo_movimientoTd
        ] = await row.$$('td').getElements()
        endosos.push({
            endoso: (await endosoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            fecha_vencimiento: (await fecha_vencimientoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            num_recibo: (await num_reciboTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            remesa: (await remesaTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            fecha_pago: (await fecha_pagoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            importe: (await importeTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            estado: (await estadoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            tipo_movimiento: (await tipo_movimientoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
        }
        )

    })

    return { endosos }

}

