import type { SaasAccount } from "@asurandi/types";
import type { WhatsappMessage } from "../../../whatsappService/types.js";
import type { MessageUpsertType, proto } from "baileys";
import { BaileyesGetMessageType } from "./getMessageType.js";

export const newWhatsappMessage = (m: {
  messages: proto.IWebMessageInfo[];
  type: MessageUpsertType;
}, account: SaasAccount): WhatsappMessage[] => {
  const allMsg: WhatsappMessage[] = []
  for (let i = 0; i < m.messages.length; i++) {
    const incomingMessage = m.messages[i];
    const isFromMe = incomingMessage.key.fromMe ?? false; // TODO Guardar un registro de mensajes enviados, si no lo tiene chatwoot, mandar un aviso.
    const isUnknown = !incomingMessage.key?.remoteJid;
    const isStatusUpdate = incomingMessage.key?.remoteJid === "status@broadcast";
    const isGroup = incomingMessage.key?.remoteJid?.includes("@g.us") ?? false;
    const isFromBot = !!incomingMessage.botMessageInvokerJid || !!incomingMessage.is1PBizBotMessage;
    const id = incomingMessage.key.id ?? Math.random().toString()

    const messageType = BaileyesGetMessageType(incomingMessage)
    const phone = `+${(incomingMessage.key.remoteJid ?? "")
      .replace("@s.whatsapp.net", "")
      .replace(/\D/g, "")}`;
    const fromJid = incomingMessage.key.remoteJid ?? null

    allMsg.push({
      protoMessage: incomingMessage,
      source: 'whatsapp-adapter',
      isFromBot,
      isFromMe,
      isGroup,
      accountId: account.id,
      account,
      isUnknown,
      isStatusUpdate,
      upsertType: m.type,
      id,
      messageType,
      phone,
      fromJid,
      direction: isFromMe ? 'outgoing' : 'incoming',
      processIntents: 0
    })
  }
  return allMsg
}