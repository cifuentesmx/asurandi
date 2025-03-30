// @ts-nocheck
import { Thread } from 'openai/resources/beta/threads/threads.mjs';
// import { ChatwootConversation } from './chatwoot-conversation';
// import { WhatsappMessage } from './whatsapp-provider';
import { MessagesPage } from 'openai/resources/beta/threads/messages.mjs';
import { Run } from 'openai/resources/beta/threads/runs/runs.mjs';
import { SaasAccount } from './saas-account.js';
export type OpenaiIncomingMessage = {
    // message: WhatsappMessage,
    // conversation: ChatwootConversation
    processIntents: number
    saasAccount: SaasAccount
}

export type OpenaiJob = {
    status: 'created' | 'waiting-response' | 'error' | 'done'
    assistantId: string
    newMessages: string[]
    saasId: number
    conversationId: number
    inboxId: number
    thread?: Thread
    run?: Run
    intents: number
    timesFailed: number
    response?: MessagesPage
    askedForTransfer?: boolean
    uploadUrls?: string[]
    responseText?: string
    saasAccount: SaasAccount

}