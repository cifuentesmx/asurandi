export type GptConversation = {
    status: 'active' | 'closed'
    id: string
}

export type GptBatch = {
    status: 'stale' | 'started' | 'waiting-response' | 'error' | 'complete'
    id?: string
    gptConversationId: string
    messages: string[]
    response?: unknown
}

