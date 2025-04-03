import type { ConnectedApp, SaasAccount, BotStatus } from "@asurandi/types"
import type { AnyMessageContent, MessageType, MessageUpsertType, proto } from "baileys"

export type InterprocessWorkerMessage = {
  type: 'terminate' | 'new-outgoing-message'
  newOutgoingMessage?: unknown
}

export type InterProcessWorkerWhatsappMessage = {
  type: 'worker-whatsapp' | 'dlxDropped'
  message: string,
  routingKey: string
}


export interface WAProvider {
  init: () => void;
  sendMessage: (
    ms: AnyMessageContent,
    jid: string
  ) => Promise<boolean | null>;
  downloadMediaMessage: (msg: WhatsappMessage) => Promise<MediaUrl>;
  stop: () => Promise<unknown>;
  statusUpdater: (status: BotStatus) => void
  onWhatsApp: (jid: string) => Promise<unknown>
  id: number
}

export type WhatsappMessage = {
  id: string;
  source: 'whatsapp-adapter'
  direction: 'incoming' | 'outgoing'
  processIntents: number
  shoulRespond?: boolean;
  protoMessage?: proto.IWebMessageInfo;
  processed?: boolean
  mediaUrls?: MediaUrl[];
  connectedApp?: ConnectedApp
  isStatusUpdate: boolean;
  isGroup: boolean;
  isUnknown: boolean;
  isFromBot: boolean;
  isFromMe: boolean;
  upsertType?: MessageUpsertType;
  accountId: string,
  account: SaasAccount
  errors?: any[];
  messageType: MessageType | null,
  phone: string,
  fromJid: string | null
};
export type MediaUrl = {
  whatsappUrl?: string;
  type: MessageType;
  caption?: string | null;
  errors: any[];
  bucketPath?: string
  publicUrl?: string
  filePath?: string;
  mimeType?: string;
};
