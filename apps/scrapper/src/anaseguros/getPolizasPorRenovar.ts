import { PolizaPorRenovar } from "@asurandi/types";

export const getAnassegurosPolizasRenovar = async (browser: WebdriverIO.Browser, saasId: string): Promise<PolizaPorRenovar[]> => {

    await browser.url('https://server.anaseguros.com.mx/ananet/pages/Reportes.aspx')
    await browser.pause(2000)

    const btn = browser.$('[nidreporte="13"]')
    await btn.waitForExist()
    await btn.waitForClickable()
    await btn.click()

    await browser.pause(2000)

    const selectAnio = await browser.$('label=AÑO:').nextElement().getElement()
    const selectMes = await browser.$('label=MES:').nextElement().getElement()


    const anios = await selectAnio.$$('option').getElements()
    const meses = await selectMes.$$('option').getElements()

    const polizas: PolizaPorRenovar[] = []


    for (const anio of anios) {
        for (const mes of meses) {
            const anioValue = await anio.getText()
            const mesValue = await mes.getText()
            const mesValueNumber = (await mes.getAttribute('value')).padStart(2, '0')

            await selectAnio.waitForClickable()
            await selectMes.waitForClickable()

            await selectAnio.selectByVisibleText(anioValue)
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


            const rows = await browser.$('#TblExport').$$('tr').getElements()
            for (const row of rows) {
                const [
                    dia_vencimiento,
                    poliza,
                    _,
                    asegurado,
                    __,
                    prima,
                ] = await row.$$('td').getElements()
                const Poliza: PolizaPorRenovar = {
                    company: 'anaseguros',
                    poliza: (await poliza?.getText())?.trim() ?? '',
                    asegurado: (await asegurado?.getText())?.trim() ?? '',
                    primaTotalActualAnterior: (await prima?.getText())?.trim() ?? '',
                    fechaVencimiento: anioValue + '/' + mesValueNumber + '/' + ((await dia_vencimiento?.getText())?.trim() ?? ''),
                    checked: '',
                    automovil: '',
                    planPago: '',
                    descuentoCartera: '',
                    causaNoRenovacion: '',
                    descuentoBuenaConducta: '',
                    estatus: '',
                    editar: ''
                }
                if (
                    !Poliza.poliza ||
                    Poliza.poliza.toLowerCase().startsWith('total') ||
                    Poliza.poliza.toLowerCase().startsWith('poliza') ||
                    Poliza.poliza.toLowerCase().startsWith('listado') ||
                    Poliza.poliza.toLowerCase().startsWith('semana')
                ) {
                    continue
                }

                polizas.push(Poliza)
            }

        }
    }
    return polizas
}