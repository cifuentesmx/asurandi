import { MovimientoPolizaAnaseguros } from "@asurandi/types"

export const getAnassegurosMovimientosPolizas = async (
    browser: WebdriverIO.Browser,
    fechaInicio: string,
    fechaFin: string
): Promise<MovimientoPolizaAnaseguros[]> => {
    const movimientos: MovimientoPolizaAnaseguros[] = []
    await browser.url('https://server.anaseguros.com.mx/ananet/pages/Reportes.aspx')
    await browser.pause(2000)

    const btn = browser.$('[nidreporte="19"]')
    await btn.waitForExist()
    await btn.waitForClickable()
    await btn.click()
    await browser.pause(2000)

    const fechaInicioInput = browser.$('.inputTxtAjustable.FechaInicio')
    const fechaFinInput = browser.$('.inputTxtAjustable.FechaFinal')


    await fechaInicioInput.waitForClickable()
    await fechaFinInput.waitForClickable()

    const cidInicio = await fechaInicioInput.getAttribute('id')
    const cidFin = await fechaFinInput.getAttribute('id')


    await browser.execute((cid, fecha) => {
        // @ts-ignore
        $(`#${cid}`).datepicker('setDate', new Date(fecha));
    }, cidInicio, fechaInicio);

    await browser.pause(1_000)

    await browser.execute((cid, fecha) => {
        // @ts-ignore
        $(`#${cid}`).datepicker('setDate', new Date(fecha));
    }, cidFin, fechaFin);


    await browser.pause(500)
    const btnGenerar = browser.$('#BtnConsultar')
    await btnGenerar.waitForClickable({ timeout: 60_000 })
        .catch(() => {
            throw new Error("No se pudo hacer click en el boton de generar")
        })
    await btnGenerar.click()
    await btnGenerar.waitForClickable({ timeout: 60_000 })
        .catch(() => {
            throw new Error("No se pudo hacer click en el boton de generar")
        })

    await browser.$('#TblExport').$$('tr').forEach(async (row) => {
        const [
            fecha_emision,
            inicio_vigencia,
            fin_vigencia,
            poliza,
            endoso,
            asegurado,
            vehiculo_descripcion,
            vehiculo_serie,
            vehiculo_modelo,
            cobertura,
            formapago,
            prima_neta,
            prima_total,
            origen,
            fecha_cancelacion,
            motivo_cancelacion,
        ] = await row.$$('td').getElements()

        const MovimientoPolizaAnaseguros: MovimientoPolizaAnaseguros = {
            fecha_emision: (await fecha_emision?.getText())?.trim() ?? '',
            inicio_vigencia: (await inicio_vigencia?.getText())?.trim() ?? '',
            fin_vigencia: (await fin_vigencia?.getText())?.trim() ?? '',
            poliza: (await poliza?.getText())?.trim() ?? '',
            endoso: (await endoso?.getText())?.trim() ?? '',
            asegurado: (await asegurado?.getText())?.trim() ?? '',
            vehiculo_descripcion: (await vehiculo_descripcion?.getText())?.trim() ?? '',
            vehiculo_serie: (await vehiculo_serie?.getText())?.trim() ?? '',
            vehiculo_modelo: (await vehiculo_modelo?.getText())?.trim() ?? '',
            cobertura: (await cobertura?.getText())?.trim() ?? '',
            formapago: (await formapago?.getText())?.trim() ?? '',
            prima_neta: (await prima_neta?.getText())?.trim() ?? '',
            prima_total: (await prima_total?.getText())?.trim() ?? '',
            origen: (await origen?.getText())?.trim() ?? '',
            fecha_cancelacion: (await fecha_cancelacion?.getText())?.trim() ?? '',
            motivo_cancelacion: (await motivo_cancelacion?.getText())?.trim() ?? '',
        }
        if (!MovimientoPolizaAnaseguros.fecha_emision
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('total')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('fec')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('ananet')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('sucursal')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('list')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('agente')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('prima')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('poliz')
            || MovimientoPolizaAnaseguros.fecha_emision.toLowerCase().startsWith('prima')
        ) {
            return
        } else {
            movimientos.push(MovimientoPolizaAnaseguros)
            console.log(MovimientoPolizaAnaseguros.fecha_emision)
        }
    })

    return movimientos
}