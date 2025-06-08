import { PolizaSiniestrada } from "@asurandi/types";

export const getAnassegurosPolizasSiniestradas = async (browser: WebdriverIO.Browser)
    : Promise<PolizaSiniestrada[]> => {

    await browser.url('https://server.anaseguros.com.mx/ananet/pages/Reportes.aspx')
    await browser.pause(2000)

    const btn = browser.$('[nidreporte="16"]')
    await btn.waitForExist()
    await btn.waitForClickable()
    await btn.click()

    await browser.pause(2000)

    const selectMes = browser.$('label.*=MES').nextElement()

    await selectMes.waitForClickable()

    const meses = await selectMes.$$('option').getElements()

    const polizas: PolizaSiniestrada[] = []


    for (const mes of [meses[0], meses[1], meses[2], meses[3]]) {
        const mesValue = await mes.getText()

        if (mesValue.toLowerCase().includes('seleccionar')) continue

        const [_, ejercicio] = (await mes.getAttribute('value'))?.split('x') ?? []
        await selectMes.waitForClickable()
        await selectMes.selectByVisibleText(mesValue)
        await browser.pause(500)

        const btnGenerar = browser.$('#BtnConsultar')
        await btnGenerar.waitForExist()
        await btnGenerar.waitForClickable().catch(() => {
            throw new Error("No se pudo hacer click en el boton de generar")
        })

        await btnGenerar.click()
        await btnGenerar.waitForClickable()

        await browser.pause(2_000)


        const rows = await browser.$('#TableExport').$$('tr').getElements()
        for (const row of rows) {
            const [
                siniestro,
                fecha_registro,
                poliza,
                _,
                __,
                ___,
                ____,
                reserva,
                _____,
                ______,
            ] = await row.$$('td').getElements()
            const Poliza: PolizaSiniestrada = {
                company: 'anaseguros',
                poliza: (await poliza?.getText())?.trim() ?? '',
                ejercicio: ejercicio ?? 'N/A',
                estimacion: (await reserva?.getText())?.trim() ?? '',
                fecha: (await fecha_registro?.getText())?.trim() ?? '',
                numSiniestro: (await siniestro?.getText())?.trim() ?? '',
                reporte: (await siniestro?.getText())?.trim() ?? ''


            }
            if (
                !Poliza.numSiniestro ||
                Number.isNaN(Number(Poliza.numSiniestro?.trim()[0] ?? 'n'))
            ) {
                continue
            }
            polizas.push(Poliza)
        }
    }
    console.table(polizas)
    return polizas
}