export type MessageBusMessage<T> = {
    ttl: number
    retry_ttl?: number
    reason?: string
    routingKey: string
    exchange: MessageBusExchageList
    intents: number
    maxIntents: number
    payload: T
}

export type MessageBusExchageList =
    | 'ex.scrapper'
    | 'ex.jobs'
    | 'ex.whatsapp'
