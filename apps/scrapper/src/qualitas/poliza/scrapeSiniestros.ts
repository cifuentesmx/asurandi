import { QualitasScrappedPolizaSiniestro, QualitasScrappedPolizaSiniestroInvolucrado } from "@asurandi/types"

export async function scrapeSiniestros(element: WebdriverIO.Element, browser: WebdriverIO.Browser): Promise<QualitasScrappedPolizaSiniestro[]> {
    const parent = element.parentElement()
    await element.waitUntil(async () => {
        return await element.isDisplayed()
    })
    await element.waitForClickable()
    await element.click()
    const reportes: QualitasScrappedPolizaSiniestro[] = []
    const table = parent.$('table')
    const body = table.$('tbody')
    const rows = await body.$$('tr').getElements()
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const involucrados: QualitasScrappedPolizaSiniestroInvolucrado[] = []
        const detalle: {
            key: string;
            value: string;
        }[] = []
        const vehiculo: {
            key: string;
            value: string;
        }[] = []
        const ajustador: {
            key: string;
            value: string;
        }[] = []
        await row.$$('u').forEach(async rep => {
            await browser.pause(1500)
            const ths = await rep.getText()
            if (ths === '') return
            let sigue = true
            await rep.waitForClickable().catch(() => {
                sigue = false
            })
            if (!sigue) return
            await rep.click()
            const modal = browser.$('#modalSinister')
            await modal.waitForDisplayed({ timeout: 10000 }).catch(async () => {
                await rep.click()
                await modal.waitForDisplayed()
            })
            const elements = modal.$('div[role="document"]').$('.modal-content')

            const content = elements.$$('.content > div')
            await content.forEach(async div => {
                if (await div.$$('div > p').length > 0) {
                    const sections = await div.$$('div').getElements()
                    const sectionName = await (await div.$$('div > p').getElements())[0].getText() ?? '__ERROR__'
                    await sections.forEach(async box => {
                        const [keyP, valueP] = await box.$$('p').getElements()
                        if (sectionName === 'Colonia') {
                            detalle.push({
                                key: (await keyP?.getText()).replace('\n', ' ') ?? '__ERROR__',
                                value: (await valueP?.getText()).replace('\n', ' ') ?? '__ERROR__',
                            })
                        }
                        if (sectionName === 'Marca') {
                            vehiculo.push({
                                key: (await keyP?.getText()).replace('\n', ' ') ?? '__ERROR__',
                                value: (await valueP?.getText()).replace('\n', ' ') ?? '__ERROR__',
                            })
                        }
                        if (sectionName === 'Número') {
                            ajustador.push({
                                key: (await keyP?.getText()).replace('\n', ' ') ?? '__ERROR__',
                                value: (await valueP?.getText()).replace('\n', ' ') ?? '__ERROR__',
                            })
                        }

                    })

                }

            })

            await browser.$('#tableInvolucrados').$$('tr').forEach(async row => {
                const [
                    conductorTd,
                    tipo_involucradoTd,
                    folio_asignacionTd,
                    proveedorTd,
                ] = await row.$$('td').getElements()
                if (conductorTd)
                    involucrados.push({
                        conductor: (await conductorTd?.getText())?.replace('\n', ' ') ?? '__ERROR__',
                        tipo_involucrado: (await tipo_involucradoTd?.getText())?.replace('\n', ' ') ?? '__ERROR__',
                        folio_asignacion: (await folio_asignacionTd?.getText())?.replace('\n', ' ') ?? '__ERROR__',
                        proveedor: (await proveedorTd?.getText())?.replace('\n', ' ') ?? '__ERROR__',
                    })
            })

            const closeBtn = modal.$('button.close')
            await closeBtn.waitForClickable()
            await closeBtn.click()
            await browser.pause(350)


        });

        const numero_reporteTd = row.$('th')
        const [
            fecha_reporteTd,
            horaTd,
            numero_siniestroTd,
            causaTd,
            fecha_ocurridoTd,
            hora_ocurridoTd,

        ] = await row.$$('td').getElements()

        reportes.push({
            numero_reporte: (await numero_reporteTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            fecha_reporte: (await fecha_reporteTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            hora: (await horaTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            numero_siniestro: (await numero_siniestroTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            causa: (await causaTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            fecha_ocurrido: (await fecha_ocurridoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            hora_ocurrido: (await hora_ocurridoTd?.getText()).replace('\n', ' ') ?? '__ERROR__',
            detalle,
            vehiculo,
            ajustador,
            involucrados
        }
        )
    }

    return reportes

}



