export type SaasAccount = {
    id: string,
    name: string
    email: string
    status: AccountStatus
    connectedApp?: ConnectedApp
    whatsappServerCluster?: string
    trial: Trial
    responder?: boolean
    assistantId?: string
    premiumGptChat?: boolean
    dailyScrapper: boolean
    lastQualitasDaily: string
    lastAnasegurosDaily: string
}

export type Trial = {
    used: boolean
    start?: number
    end?: number
}

export type AccountStatus = 'trialing' | 'active' | 'suspended' | 'deleted' | 'canceled'

export type ConnectedApp = 'asurandi'

export type ChatwootConfig = {
    saasId: number
    inboxId: number
    botId: number
    selfAssignConversations: boolean
}

