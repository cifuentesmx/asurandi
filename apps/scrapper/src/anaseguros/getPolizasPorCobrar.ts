import { PolizaPorCobrar } from "@asurandi/types";

export const getAnassegurosPolizasPorCobrar = async (browser: WebdriverIO.Browser, saasId: string): Promise<PolizaPorCobrar[]> => {

    await browser.url('https://server.anaseguros.com.mx/ananet/pages/Reportes.aspx')
    await browser.pause(2000)

    const btn = browser.$('[nidreporte="12"]')
    await btn.waitForExist()
    await btn.waitForClickable()
    await btn.click()

    await browser.pause(2000)

    const selectAnio = browser.$('label=AÑO:').nextElement()
    const selectMes = browser.$('label=MES:').nextElement()

    await selectAnio.waitForExist()
    await selectMes.waitForExist()

    const anios = await selectAnio.$$('option').getElements()
    const meses = await selectMes.$$('option').getElements()

    const polizas: PolizaPorCobrar[] = []


    for (const anio of anios) {
        for (const mes of meses) {
            const anioValue = await anio.getText()
            const mesValue = await mes.getText()

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
                const [poliza,
                    endoso,
                    asegurado,
                    recibo,
                    serie,
                    prima,
                    fecha_calendario,
                    comision_agente,
                    fecha_vencimiento,
                    forma_pago]
                    = await row.$$('td').getElements()
                const Poliza: PolizaPorCobrar = {
                    company: 'anaseguros',
                    poliza: (await poliza?.getText())?.trim() ?? '',
                    endoso: (await endoso?.getText())?.trim() ?? '',
                    fechaVencimiento: (await fecha_vencimiento?.getText())?.trim() ?? '',
                    formaPago: (await forma_pago?.getText())?.trim() ?? '',
                    asegurado: (await asegurado?.getText())?.trim() ?? '',
                    serie: (await serie?.getText())?.trim() ?? '',
                    numeroRecibo: (await recibo?.getText())?.trim() ?? '',
                    importe: (await prima?.getText())?.trim() ?? '',
                    periodoGracia: (await fecha_calendario?.getText())?.trim() ?? '',
                    ramo: '',
                    moneda: 'MXN',
                    actividad: 'Comision Agente: ' + ((await comision_agente?.getText())?.trim() ?? ''),
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