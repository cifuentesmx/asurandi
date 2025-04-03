import { getQualitasPolizasCanceladas } from "./getQualitasPolizasCanceladas.js"
import { getQualitasPolizasNoRenovadas } from "./getQualitasPolizasNoRenovadas.js"
import { getQualitasPolizasPorVencer } from "./getQualitasPolizasPorVencer.js"
import { getQualitasPolizasEmitidas } from "./getQualitasPolizasEmitidas.js"
import { getQualitasPolizasRenovadas } from "./getQualitasPolizasRenovadas.js"
import { getQualitasPolizasPagadas } from "./getQualitasPolizasPagadas.js"
import { getQualitasPolizasSiniestradas } from "./getQualitasPolizasSiniestradas.js"
import { getQualitasPolizasPorRenovar } from "./getQualitasPolizasPorRenovar.js"
import { getQualitasPolizasPorCobrar } from "./getQualitasPolizasPorCobrar.js"
import { handleScrapped } from "../database/handleScrapped.js"
import { QualitasScrappedDailyStats, ScrappedPolizaEvent, CompanyPortalSession } from "@asurandi/types"
import { handleDailyScrap } from "../database/handleDailyScrap.js"
import { qualitasLogin } from "./qualitasLogin.js"
import { updatePoliza } from "./updatePoliza.js"
import { pgDb } from "../database/db.js"
import { tblPolizas } from "@asurandi/database"
import { and, eq, gte, sql } from "drizzle-orm"
import { updateAll } from "../database/updateAll.js"


export class QualitasPortalSession implements CompanyPortalSession {
    private saasId: string;
    private browser: WebdriverIO.Browser | null;
    private mainWindow?: string;
    private agent: string;
    private cuenta: string;
    private claveAgente: string;

    constructor(
        { saasId, agent, cuenta }:
            { saasId: string, agent: string, cuenta: string }) {
        this.saasId = saasId
        this.browser = null
        this.agent = agent
        this.cuenta = cuenta
        this.claveAgente = `${this.agent}-${this.cuenta}`
    }
    public async open() {
        const browser = await qualitasLogin(this.saasId, `${this.agent}-${this.cuenta}`)
        await browser.pause(5000)
        if (!browser) {
            await this.close()
            throw new Error("No se pudo iniciar conexión con el servidor de selenium");
        }
        this.browser = browser
        this.mainWindow = await this.browser.getWindowHandle()

    }
    public async close() {
        await this.browser?.deleteSession({ shutdownDriver: true })
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
    public async updatePoliza(numero_poliza: string): Promise<ScrappedPolizaEvent> {
        if (!this.browser) throw new Error("No se ha iniciado sesión en la compañia de qualitas");
        if (!this.mainWindow) throw new Error("No se ha identificado o no se encuentra la ventana principal del portal de qualitas");
        return await updatePoliza(numero_poliza, this.browser, this.saasId)
    }
    public async dailyScrapper(start: string, end: string): Promise<void> {
        console.info('Iniciando Scrapping', this.claveAgente)
        await updateAll(this.saasId)
        if (!this.browser) throw new Error("No se ha iniciado sesión en la compañia de qualitas");
        if (!this.mainWindow) throw new Error("No se ha identificado o no se encuentra la ventana principal del portal de qualitas");
        // return await getQualitasDecenas(this.browser, this.saasId, this.claveAgente)
        const aStart = start.split('-')
        const fStart = `${aStart[2]}-${aStart[1]}-${aStart[0]}`
        const aEnd = end.split('-')
        const fEnd = `${aEnd[2]}-${aEnd[1]}-${aEnd[0]}`

        console.info('Obteniendo polizas porRenovar... ')
        console.time(`Tiempo transcurrido`)
        const porRenovar = await getQualitasPolizasPorRenovar(this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas porCobrar... ')
        console.time(`Tiempo transcurrido`)
        const porCobrar = await getQualitasPolizasPorCobrar(this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas canceladas...')
        console.time(`Tiempo transcurrido`)
        const canceladas = await getQualitasPolizasCanceladas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas noRenovadas... ')
        console.time(`Tiempo transcurrido`)
        const noRenovadas = await getQualitasPolizasNoRenovadas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas porVencer... ')
        console.time(`Tiempo transcurrido`)
        const porVencer = await getQualitasPolizasPorVencer(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas pagadas... ')
        console.time(`Tiempo transcurrido`)
        const pagadas = await getQualitasPolizasPagadas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas renovadas... ')
        console.time(`Tiempo transcurrido`)
        const renovadas = await getQualitasPolizasRenovadas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas emitidas... ')
        console.time(`Tiempo transcurrido`)
        const emitidas = await getQualitasPolizasEmitidas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.size} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas siniestradas... ')
        console.time(`Tiempo transcurrido`)
        const siniestradas = await getQualitasPolizasSiniestradas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s).`)
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        const dailyQualitasScrappedMessage: QualitasScrappedDailyStats = {
            canceladas,
            noRenovadas,
            porVencer,
            renovadas,
            pagadas,
            porRenovar,
            porCobrar,
        }

        const toScrape: Set<string> = new Set()
        const candidates: Set<string> = new Set()

        canceladas.forEach(p => {
            candidates.add(p.poliza)
        });
        noRenovadas.forEach(p => {
            candidates.add(p.poliza)
        });
        porVencer.forEach(p => {
            candidates.add(p.poliza)
        });
        pagadas.forEach(p => {
            candidates.add(p.poliza)
        });
        emitidas.forEach(p => {
            candidates.add(p.poliza)
        });
        renovadas.forEach(p => {
            candidates.add(p.polizaAnterior)
            candidates.add(p.polizaRenovada)
        });
        siniestradas.forEach(p => {
            candidates.add(p.poliza)
        });

        for await (const poliza of candidates) {
            const [existing] = await pgDb.select({ id: tblPolizas.id }).from(tblPolizas).where(
                and(
                    eq(tblPolizas.saasId, this.saasId),
                    eq(tblPolizas.numeroPoliza, poliza),
                    eq(tblPolizas.esMaestra, true),
                    gte(tblPolizas.lastSync, sql`current_date`),
                ),

            )
            if (!existing) toScrape.add(poliza)
        }


        const mixed = [...porRenovar, ...porCobrar]
        for (let idx = 0; idx < mixed.length; idx++) {
            const item = mixed[idx];
            const [poliza] = await pgDb.select({ id: tblPolizas.id })
                .from(tblPolizas)
                .where(and(
                    eq(tblPolizas.saasId, this.saasId),
                    eq(tblPolizas.numeroPoliza, item.poliza),
                    eq(tblPolizas.esMaestra, true)
                ))
            if (!poliza) toScrape.add(item.poliza)
        }


        for await (const poliza of toScrape) {
            console.time(`Póliza ${poliza}:`)
            try {
                const scrapped = await this.updatePoliza(poliza)
                await handleScrapped(scrapped, this.claveAgente)

            } catch (error) {
                if (error instanceof Error)
                    console.error(`Error en póliza ${poliza}. ${error.message}`)
                console.error(error)
                // else console.error(error)
                canceladas.forEach(element => {
                    if (element.poliza === poliza)
                        console.log('canceladas', element.poliza)
                });
                noRenovadas.forEach(element => {
                    if (element.poliza === poliza)
                        console.log('noRenovadas', element.poliza)
                });
                porVencer.forEach(element => {
                    if (element.poliza === poliza)
                        console.log('porVencer', element.poliza)
                });
                renovadas.forEach(element => {
                    if (element.polizaAnterior === poliza)
                        console.log('renovadas.anterior', element.polizaAnterior)
                    if (element.polizaRenovada === poliza)
                        console.log('renovadas.renovada', element.polizaRenovada)
                });
                pagadas.forEach(element => {
                    if (element.poliza === poliza)
                        console.log('pagadas', element.poliza)
                });
                porRenovar.forEach(element => {
                    if (element.poliza === poliza)
                        console.log('porRenovar', element.poliza)
                });
                porCobrar.forEach(element => {
                    if (element.poliza === poliza)
                        console.log('porCobrar', element.poliza)
                });
            } finally {
                console.timeEnd(`Póliza ${poliza}:`)
            }
        }
        await this.browser.pause(1500)

        await handleDailyScrap(dailyQualitasScrappedMessage, this.saasId)

        return
    }
}