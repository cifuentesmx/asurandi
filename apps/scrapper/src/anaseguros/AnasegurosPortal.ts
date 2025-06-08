import { CompanyPortalSession, PolizasToScrapeFromDaily } from "@asurandi/types";
import { openAnasegurosSession } from "./openSession.js";
import { getAnassegurosPolizasPorCobrar } from "./getPolizasPorCobrar.js";
import { getAnassegurosPolizasRenovar } from "./getPolizasPorRenovar.js";
import { getAnassegurosMovimientosPolizas } from "./getMovimientosPolizas.js";
import { getAnassegurosPolizasSiniestradas } from "./getSiniestros.js";
import { scrapePoliza } from "./scrapePoliza.js";
// import path from "node:path";
// import fs from "node:fs";

export class AnasegurosPortal implements CompanyPortalSession {
    private saasId: string;
    private agent: string;
    private cuenta: string;
    private sessionId: string
    private browser: WebdriverIO.Browser | null = null;
    private mainWindow?: string;

    constructor(
        { saasId, agent, cuenta }:
            { saasId: string, agent: string, cuenta: string }) {
        this.saasId = saasId
        this.agent = agent
        this.cuenta = cuenta
        this.sessionId = `${this.saasId}s-${this.agent}-${this.cuenta}`
    }

    async open() {
        const browser = await openAnasegurosSession(this.saasId, `${this.agent}-${this.cuenta}`)
        if (!browser) {
            await this.close()
            throw new Error("No se pudo iniciar conexión con el servidor de selenium");
        }
        this.browser = browser
        this.mainWindow = await this.browser.getWindowHandle()
    }

    async close() {
        await this.browser?.deleteSession({ shutdownDriver: true })
        await new Promise(resolve => setTimeout(resolve, 2500));
    }

    async updatePoliza(numero_poliza: string, dataFromDailyScrapper?: PolizasToScrapeFromDaily): Promise<void> {
        if (!this.browser) throw new Error("No se ha iniciado sesión en la compañia de qualitas");
        if (!this.mainWindow) throw new Error("No se ha identificado o no se encuentra la ventana principal del portal de qualitas");
        return await scrapePoliza(numero_poliza, this.browser, this.saasId, this.agent, dataFromDailyScrapper)
    }

    async dailyScrapper(start: string, end: string): Promise<void> {
        // const filePath = path.join(process.cwd(), 'polizasToScrape.json')
        // if (fs.existsSync(filePath)) {
        //     return
        // }

        console.info('Iniciando Scrapping en Anaseguros', this.sessionId)
        if (!this.browser) throw new Error("No se ha iniciado sesión en la compañia de anaseguros");
        if (!this.mainWindow) throw new Error("No se ha identificado o no se encuentra la ventana principal del portal de anaseguros");


        const polizasToScrape: Map<string, PolizasToScrapeFromDaily> = new Map<string, PolizasToScrapeFromDaily>()

        console.info('Obteniendo polizas por cobrar en Anaseguros... ')
        await getAnassegurosPolizasPorCobrar(this.browser, this.saasId).then(r => {
            console.info(`Se han obtenido ${r.length} póliza(s) por cobrar.`)
            r.forEach(p => {
                const existing = polizasToScrape.get(p.poliza)
                if (!existing) polizasToScrape.set(p.poliza, { porCobrar: [p] })
                else polizasToScrape.set(p.poliza, { ...existing, porCobrar: [...existing?.porCobrar ?? [], p] })
            })
        })

        console.info('Obteniendo polizas por renovar en Anaseguros... ')
        await getAnassegurosPolizasRenovar(this.browser, this.saasId).then(r => {
            console.info(`Se han obtenido ${r.length} póliza(s) por renovar.`)
            r.forEach(p => {
                const existing = polizasToScrape.get(p.poliza)
                if (!existing) polizasToScrape.set(p.poliza, { porRenovar: p })
                else polizasToScrape.set(p.poliza, { ...existing, porRenovar: p })
            })
        })

        console.info('Obteniendo movimientos de polizas en Anaseguros... ')
        await getAnassegurosMovimientosPolizas(this.browser, start, end).then(r => {
            console.info(`Se han obtenido ${r.length} movimiento(s) de polizas.`)
            r.forEach(p => {
                const existing = polizasToScrape.get(p.poliza)
                if (!existing) polizasToScrape.set(p.poliza, { movimientosAnaseguros: [p] })
                else polizasToScrape.set(p.poliza, { ...existing, movimientosAnaseguros: [...existing?.movimientosAnaseguros ?? [], p] })
            })
        })

        console.info('Obteniendo movimientos de polizas en Anaseguros... ')
        await getAnassegurosPolizasSiniestradas(this.browser).then(r => {
            console.info(`Se han obtenido ${r.length} movimiento(s) de polizas.`)
            r.forEach(p => {
                const existing = polizasToScrape.get(p.poliza)
                if (!existing) polizasToScrape.set(p.poliza, { siniestradas: [p] })
                else polizasToScrape.set(p.poliza, { ...existing, siniestradas: [...existing?.siniestradas ?? [], p] })
            })
        })


        // fs.writeFileSync(filePath, JSON.stringify(Array.from(polizasToScrape.entries()), null, 2));
        // console.info(`Polizas guardadas en: ${filePath}`);
    }
}