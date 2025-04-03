import { Aseguradoras } from "../company/index.js"

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
}

