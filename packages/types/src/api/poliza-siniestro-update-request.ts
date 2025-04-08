import { Aseguradoras } from "../company/index.js"
import { PolizasToScrapeFromDaily } from "../qualitas/daily-scrapped.js"

export type UpdateRequestPolizasInRange = {
    saasId: string
    company: Aseguradoras
    intents: number
    start: string
    end: string
}

export type UpdateRequestPoliza = {
    numeroPoliza: string
    saasId: string
    company: Aseguradoras
    intents: number
    agent: string
    cuenta: string
    dataFromDailyScrapper?: PolizasToScrapeFromDaily
}

