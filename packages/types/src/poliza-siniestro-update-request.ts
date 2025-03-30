export type PolizaSiniestroUpdateRequestRange = {
    saasId: string
    company: 'qualitas'
    intents: number
    start: string
    end: string
}

export type PolizaSiniestroUpdateRequest = {
    numeroPoliza: string
    saasId: string
    company: 'qualitas'
    intents: number
    agent: string
    cuenta: string
}

