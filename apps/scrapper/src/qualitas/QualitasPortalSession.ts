import { getQualitasPolizasCanceladas } from "./getQualitasPolizasCanceladas.js"
import { getQualitasPolizasNoRenovadas } from "./getQualitasPolizasNoRenovadas.js"
import { getQualitasPolizasPorVencer } from "./getQualitasPolizasPorVencer.js"
import { getQualitasPolizasEmitidas } from "./getQualitasPolizasEmitidas.js"
import { getQualitasPolizasRenovadas } from "./getQualitasPolizasRenovadas.js"
import { getQualitasPolizasPagadas } from "./getQualitasPolizasPagadas.js"
import { getQualitasPolizasSiniestradas } from "./getQualitasPolizasSiniestradas.js"
import { getQualitasPolizasPorRenovar } from "./getQualitasPolizasPorRenovar.js"
import { getQualitasPolizasPorCobrar } from "./getQualitasPolizasPorCobrar.js"
// import { handleScrapped } from "../database/handleScrapped.js"
import { ScrappedPolizaEvent, CompanyPortalSession, PolizasToScrapeFromDaily } from "@asurandi/types"
import { qualitasLogin } from "./qualitasLogin.js"
import { updatePoliza } from "./updatePoliza.js"
// import { pgDb } from "../database/db.js"
// import { tblPolizas } from "@asurandi/database"
// import { and, eq, gte, sql } from "drizzle-orm"
import { updateAll } from "../database/updateAll.js"
import { qualitasProcessPolizasToScrape } from "./qualitasProcessPolizasToScrape.js"


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

        const aStart = start.split('-')
        const fStart = `${aStart[2]}-${aStart[1]}-${aStart[0]}`
        const aEnd = end.split('-')
        const fEnd = `${aEnd[2]}-${aEnd[1]}-${aEnd[0]}`



        const polizasToScrape: Map<string, PolizasToScrapeFromDaily> = new Map<string, PolizasToScrapeFromDaily>()

        console.info('Obteniendo polizas porCobrar... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasPorCobrar(this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) por cobrar.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { porCobrar: [p] })
                    else polizasToScrape.set(p.poliza, { ...existing, porCobrar: [...existing?.porCobrar ?? [], p] })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas porRenovar... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasPorRenovar(this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) por renovar.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { porRenovar: p })
                    else polizasToScrape.set(p.poliza, { ...existing, porRenovar: p })
                })
                return r
            })
            .catch(e => {
                console.error(e)
                throw e
            })
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas canceladas...')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasCanceladas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) canceladas.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { canceladas: p })
                    else polizasToScrape.set(p.poliza, { ...existing, canceladas: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas noRenovadas... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasNoRenovadas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) no renovadas.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { noRenovadas: p })
                    else polizasToScrape.set(p.poliza, { ...existing, noRenovadas: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas porVencer... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasPorVencer(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) por vencer.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { porVencer: p })
                    else polizasToScrape.set(p.poliza, { ...existing, porVencer: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas pagadas... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasPagadas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) pagadas.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { pagadas: p })
                    else polizasToScrape.set(p.poliza, { ...existing, pagadas: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas renovadas... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasRenovadas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) renovadas.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.polizaAnterior)
                    if (!existing) polizasToScrape.set(p.polizaAnterior, { renovadas: p })
                    else polizasToScrape.set(p.polizaAnterior, { ...existing, renovadas: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas emitidas... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasEmitidas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) emitidas.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { emitidas: p })
                    else polizasToScrape.set(p.poliza, { ...existing, emitidas: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        console.info('Obteniendo polizas siniestradas... ')
        console.time(`Tiempo transcurrido`)
        await getQualitasPolizasSiniestradas(fStart, fEnd, this.browser, this.saasId)
            .then(r => {
                console.info(`Se han obtenido ${r.length} póliza(s) siniestradas.`)
                r.forEach(p => {
                    const existing = polizasToScrape.get(p.poliza)
                    if (!existing) polizasToScrape.set(p.poliza, { siniestradas: p })
                    else polizasToScrape.set(p.poliza, { ...existing, siniestradas: p })
                })
                return r
            })
            .catch(e => console.error(e))
            .finally(() => console.timeEnd(`Tiempo transcurrido`)) ?? []

        await qualitasProcessPolizasToScrape(polizasToScrape,
            this.saasId,
            this.cuenta,
            this.agent)
        return
    }
}