export type MessageBusMessage<T> = {
    ttl: number
    retry_ttl: number
    routingKey: string
    exchange: MessageBusExchageList
    intents: number
    maxIntents: number
    payload: T
}

export type MessageBusExchageList =
    | 'ex.scrapper'
    | 'ex.app'
    | 'ex.whatsapp'
    | 'ex.whatsapp.retry'
    | 'ex.dlx.dropped'