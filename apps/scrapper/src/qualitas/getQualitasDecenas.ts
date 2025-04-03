import { pgDb } from "../database/db.js"
import { and, eq, InferInsertModel } from 'drizzle-orm';
import { tblScrappedLogs } from "@asurandi/database"
import { existsSync } from 'fs'
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import fs from 'fs';

export type QualitasEstadosCuentaPortalTable = Partial<{
    seleccionar: string,
    periodo: string,
    estatusFactura: string,
    tipoCambio: string,
    folio: string,
    statusPago: string,
    pdf: string,
    xls: string,
}>

export async function getQualitasDecenas(browser: WebdriverIO.Browser, saasId: string, claveAgente: string)
    : Promise<void> {
    await browser.url(`https://agentes360.qualitas.com.mx/group/guest/comisiones-y-bonos`)
    // await browser.keys("\uE007")
    // await browser.pause(150)


    let none: number = 0
    await browser.waitUntil(async () => {
        none = await browser.$$('*=Mostrando 0 de 0 resultados').length + await browser.$$('*=No se encontraron pólizas canceladas').length
        const found = await browser.$$('#tableEdoCuenta_paginate').length
        return found > 0 || none > 0
    })


    if (none > 0) throw new Error("No se pudo localizar la tabla de decenas");


    // Scrape all decenas
    const ul = browser.$('#tableEdoCuenta_paginate > ul')
    const scrappedPages: string[] = []
    const tbody = await browser.$('table#tableEdoCuenta > tbody').getElement()

    const lis = await ul.$$('li').getElements()
    for (let i = 0; i < lis.length; i++) {
        const id = await ul.$('li.active>a').getAttribute('data-dt-idx')
        const isNext = await ul.$('li.active>a').getAttribute('id')
        if (id === '0' || isNext === 'tableEdoCuenta_next') continue
        if (!scrappedPages.includes(id)) {
            scrappedPages.push(id)
            await browser.pause(5000)
            const rows = await tbody.$$('tr').getElements()
            for (let idx = 0; idx < rows.length; idx++) {
                const row = rows[idx];
                const [
                    seleccionar,
                    periodo,
                    estatusFactura,
                    tipoCambio,
                    folio,
                    statusPago,
                    pdf,
                    xls,
                ] = await row.$$('td').getElements()
                const fila: QualitasEstadosCuentaPortalTable = {
                    seleccionar: await seleccionar?.getText() ?? 'NA',
                    periodo: await periodo?.getText() ?? 'NA',
                    estatusFactura: await estatusFactura?.getText() ?? 'NA',
                    tipoCambio: await tipoCambio?.getText() ?? 'NA',
                    folio: await folio?.getText() ?? 'NA',
                    statusPago: await statusPago?.getText() ?? 'NA',
                    pdf: await pdf?.getText() ?? 'NA',
                    xls: await xls?.getText() ?? 'NA',
                }


                // check existing DECENAS
                const key = `${claveAgente}|${fila.periodo}|${fila.estatusFactura}`
                const accion = 'estado-cuenta'
                let [existing] = await pgDb.select()
                    .from(tblScrappedLogs)
                    .where(and(
                        eq(tblScrappedLogs.saasId, saasId),
                        eq(tblScrappedLogs.companyId, 'qualitas'),
                        eq(tblScrappedLogs.accion, accion),
                        eq(tblScrappedLogs.key, key)
                    ))

                const usLog: InferInsertModel<typeof tblScrappedLogs> = {
                    accion: existing?.accion ?? accion,
                    key: existing?.key ?? key,
                    companyId: 'qualitas',
                    updated: new Date(),
                    saasId: saasId,
                    messages: existing?.messages ?? ['Iniciando el proceso de recuperación de ingreso por comisiones en Quálitas'],
                    status: existing?.status ?? 'Started',
                    created: existing?.created ?? new Date(),
                }
                if (!existing) {
                    [existing] = await pgDb
                        .insert(tblScrappedLogs)
                        .values(usLog)
                        .returning()
                }

                // check for file existence
                const fullName = `${process.cwd()}/storage/${saasId}/qualitas/decenas/${claveAgente}/${fila.periodo}-${fila.estatusFactura}.xlsx`
                const fileExists = existsSync(fullName);
                if (!fileExists) {
                    const icons = await row.$$('img').getElements()
                    for (let idx = 0; idx < icons.length; idx++) {
                        const icon = icons[idx];
                        const src: string | undefined = await icon.getProperty('src') as string | undefined
                        if (!src || !src.endsWith('xls.svg')) continue
                        const a = await icon.parentElement().parentElement()
                        await a.waitForClickable().catch(() => { console.log('>>>>> not clickable') })
                        const jQueryString = await a.getAttribute('onclick')
                        const { url, params } = extractUrlAndParams(jQueryString)
                        const cookies = await getBrowserCookies(browser);

                        try {
                            console.log('Iniciando descarga con URL:', url);
                            console.log('Params:', params);

                            // Modificar la URL para usar el formato correcto de Liferay
                            const formData = new URLSearchParams();
                            formData.append('agent', params.agent);
                            formData.append('num', params.num);
                            formData.append('desc', params.desc);
                            formData.append('concept', params.concept);

                            console.log(params)

                            console.log('FormData:', Object.fromEntries(formData));

                            // Construir la URL completa con los parámetros
                            const fullUrl = `${url}`;
                            console.log('URL completa:', fullUrl);

                            const response = await fetch(fullUrl, {
                                method: 'POST',
                                body: JSON.stringify(Object.fromEntries(formData)),
                                headers: {
                                    'Cookie': cookies,
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Accept': 'application/vnd.ms-excel',
                                    'Referer': 'https://agentes360.qualitas.com.mx/group/guest/comisiones-y-bonos',
                                    'User-Agent': await browser.execute(() => navigator.userAgent)
                                }
                            });

                            console.log('Response status:', response.status);
                            console.log('Response headers:', response.headers);

                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                            }

                            // Verificar el Content-Type de la respuesta
                            const contentType = response.headers.get('content-type');
                            console.log('Content-Type:', contentType);

                            // Verificar el tamaño de la respuesta
                            const contentLength = response.headers.get('content-length');
                            console.log('Content-Length:', contentLength);

                            // Obtener el contenido como array buffer
                            const arrayBuffer = await response.arrayBuffer();
                            console.log('ArrayBuffer length:', arrayBuffer.byteLength);

                            if (arrayBuffer.byteLength === 0) {
                                throw new Error(`Respuesta vacía del servidor. Content-Type: ${contentType}, Content-Length: ${contentLength}`);
                            }

                            const buffer = Buffer.from(arrayBuffer);
                            console.log('Buffer length:', buffer.length);

                            // Asegurar que el directorio existe
                            const dirPath = dirname(fullName);
                            await mkdir(dirPath, { recursive: true });

                            // Escribir el archivo
                            await writeFile(fullName, buffer);

                            // Verificar el archivo después de escribirlo
                            const stats = await fs.promises.stat(fullName);
                            console.log(`Archivo guardado. Tamaño: ${stats.size} bytes`);

                            if (stats.size === 0) {
                                throw new Error('El archivo se guardó pero está vacío');
                            }

                            console.log(`Archivo guardado exitosamente en: ${fullName}`);


                        } catch (error) {
                            if (error instanceof Error) {
                                console.error('Error completo:', error);
                                console.error('Stack trace:', error.stack);
                                console.error('Error detallado:', error);

                                // Actualizar el registro con el error
                                await pgDb
                                    .update(tblScrappedLogs)
                                    .set({
                                        status: 'Errored',
                                        updated: new Date(),
                                        messages: [...(existing?.messages ?? []),
                                        `Error al descargar archivo: ${error.message}`,
                                        `URL intentada: ${url}`]
                                    })
                                    .where(and(
                                        eq(tblScrappedLogs.saasId, saasId),
                                        eq(tblScrappedLogs.key, key)
                                    ));
                            }
                        }

                        await browser.pause(5000)
                    }
                }

                return
            }
        }
    }
}

interface RequestParams {
    agent: string;
    num: string;
    desc: string;
    concept: string;
}

function extractUrlAndParams(jQueryString: string): { url: string, params: RequestParams } {
    // Extraer la URL usando expresiones regulares
    const urlRegex = /'(https:\/\/[^']+)'/;
    const urlMatch = jQueryString.match(urlRegex);
    const url = urlMatch ? urlMatch[1] : '';

    // Extraer los parámetros entre llaves
    const paramsRegex = /\{([^}]+)\}/;
    const paramsMatch = jQueryString.match(paramsRegex);

    // Convertir los parámetros a un objeto
    const paramsString = paramsMatch ? paramsMatch[1] : '';
    const params: RequestParams = paramsString.split(',')
        .reduce((acc: any, curr: string) => {
            const [key, value] = curr.split(':').map(s => s.trim());
            acc[key] = value.replace(/'/g, '');
            return acc;
        }, {});

    return { url, params };
}

async function getBrowserCookies(browser: WebdriverIO.Browser): Promise<string> {
    const cookies = await browser.getCookies();
    return cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
}