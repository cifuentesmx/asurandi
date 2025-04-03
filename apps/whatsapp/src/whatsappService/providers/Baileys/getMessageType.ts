import type { MessageType, proto } from "baileys";

export const BaileyesGetMessageType = (message: proto.IWebMessageInfo): MessageType | null => {
  //Detectar location
  if (message.message?.locationMessage) {
    return "locationMessage";
  }
  if (message.message?.liveLocationMessage) {
    return "liveLocationMessage";
  }

  //Detectar video
  if (message.message?.videoMessage) {
    return "videoMessage";
  }

  //Detectar Sticker
  if (message.message?.stickerMessage) {
    return "stickerMessage";
  }
  if (message.message?.stickerSyncRmrMessage) {
    return "stickerSyncRmrMessage";
  }
  if (message.message?.lottieStickerMessage) {
    return "lottieStickerMessage";
  }

  //Detectar media
  if (message.message?.imageMessage) {
    return "imageMessage";
  }

  //Detectar file
  if (message.message?.documentMessage) {
    return "documentMessage";
  }
  if (message.message?.documentWithCaptionMessage) {
    return "documentWithCaptionMessage";
  }

  //Detectar voice note
  if (message.message?.audioMessage) {
    return "audioMessage";
  }

  if (message.message?.extendedTextMessage) {
    return 'extendedTextMessage'
  }
  if (message.message?.extendedTextMessageWithParentKey) {
    return 'extendedTextMessageWithParentKey'
  }
  return null
};
