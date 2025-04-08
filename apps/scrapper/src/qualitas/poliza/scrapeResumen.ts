import { ScrappedPolizaResumen } from "@asurandi/types"

export async function scrapeResumen(numero_poliza: string, element: WebdriverIO.Element): Promise<ScrappedPolizaResumen> {
    const title = await element.getText()
    const parent = element.parentElement()

    await element.waitUntil(async () => {
        return await element.isDisplayed()
    })

    await element.waitForClickable()
    await element.click()
    const serialData: { key: string, value: string }[] = []
    await parent.$$('div').forEach(async info => {
        if (await info.getAttribute('id') !== await element.getAttribute('id')) {
            await info.$$('div').forEach(async div => {

                if (await div.$$('p').length === 2) {
                    const [key, value] = await div.$$('p').getElements()
                    const theKey = await key.getText()
                    if (theKey && theKey !== '') serialData.push({
                        key: theKey.replace('\n', ' '),
                        value: (await value.getText()).replace('\n', ' ')
                    })

                }

            })
        }
    })
    const tblParent = await parent.$('#tableCobertura').getElement()
    const coberturas: {
        cobertura: string
        sumaAsegurada: string
        deducible: string
        prima: string
    }[] = []
    await tblParent.$$('tr').forEach(async row => {
        const [sumaAseguradaTd, deducibleTd, primaTd] = await row.$$('td').getElements()
        const [coberturaTd] = await row.$$('th').getElements()
        if (sumaAseguradaTd)
            coberturas.push({
                cobertura: await coberturaTd?.getText() ?? 'NA',
                sumaAsegurada: await sumaAseguradaTd?.getText() ?? 'NA',
                deducible: await deducibleTd?.getText() ?? 'NA',
                prima: await primaTd?.getText() ?? 'NA',
            })
    })


    const isExpanded = await element.getAttribute('aria-expanded') === 'true';

    return { numero_poliza, title, isExpanded, serialData, coberturas }
}


