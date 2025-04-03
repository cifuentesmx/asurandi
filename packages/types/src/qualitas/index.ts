export type QualitasAccountCredential = {
    id: string
    agente: string
    cuenta: string
    password: string
    alias?: string
}

export * from  './daily-scrapped.js'
export * from './scrape-fleet.js'
export * from  './scrape-poliza.js'