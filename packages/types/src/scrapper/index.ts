import { ScrappedPolizaEvent } from "../events/scrapper.js"

export interface CompanyPortalSession {
    open(): Promise<void>
    close(): Promise<void>
    updatePoliza(numero_poliza: string): Promise<ScrappedPolizaEvent>
    dailyScrapper(start: string, end: string): Promise<void>
}
