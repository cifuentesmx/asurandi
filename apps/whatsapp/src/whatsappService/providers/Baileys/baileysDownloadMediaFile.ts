import { getExtensionFromMime } from '@/lib/getExtensionFromMime.ts';
import { uploadFile } from '@/lib/uploadFile.ts';
import type { MediaUrl, WhatsappMessage } from '@/whatsappService/types.ts';
import { downloadContentFromMessage, downloadMediaMessage } from 'baileys';
import { existsSync, mkdirSync } from 'fs';

import { writeFile } from "fs/promises";

export async function baileysDownloadMediaFile(message: WhatsappMessage): Promise<MediaUrl> {
  try {

    const url: MediaUrl = {
      errors: [],
      type: message.messageType ?? 'chat',
    };
    const ctx = message.protoMessage;
    if (!ctx?.message) {
      console.error('🚨 Hay que debuguear esto: ¿Porqué no hay un protomessage?')
      console.error(message)
      throw new Error("Not an incoming message");
    }

    const name =
      message.protoMessage?.message?.documentMessage?.fileName?.replace(
        /\.[^/.]+$/,
        ""
      ) ?? message.id;

    const buffer = await downloadMediaMessage(ctx, "buffer", {}).catch(
      async (error) => {
        // TODO retry with https://github.com/WhiskeySockets/Baileys/issues/465

        console.error('🚨 ¿Porqué falló la primera vez?')
        console.error(error)

        let mediaKey: Uint8Array | null | undefined;
        let type:
          | undefined
          | "sticker"
          | "video"
          | "document"
          | "image"
          | "audio";
        let directPath: string | null | undefined;

        try {
          if (message.messageType === 'stickerMessage') {
            mediaKey = message.protoMessage?.message?.stickerMessage?.mediaKey;
            type = "sticker";
            directPath =
              message.protoMessage?.message?.stickerMessage?.directPath;
          }
          if (message.messageType === "videoMessage") {
            mediaKey = message.protoMessage?.message?.videoMessage?.mediaKey;
            type = "video";
            directPath =
              message.protoMessage?.message?.videoMessage?.directPath;
          }

          if (message.messageType === "documentMessage" || message.messageType === 'documentWithCaptionMessage') {
            mediaKey = message.protoMessage?.message?.documentMessage?.mediaKey;
            type = "document";
            directPath =
              message.protoMessage?.message?.documentMessage?.directPath ??
              message.protoMessage?.message?.documentWithCaptionMessage?.message
                ?.documentMessage?.directPath;
          }

          if (message.messageType === "imageMessage") {
            mediaKey = message.protoMessage?.message?.imageMessage?.mediaKey;
            type = "image";
            directPath =
              message.protoMessage?.message?.imageMessage?.directPath;
          }

          if (message.messageType === "audioMessage") {
            mediaKey = message.protoMessage?.message?.audioMessage?.mediaKey;
            type = "audio";
            directPath =
              message.protoMessage?.message?.audioMessage?.directPath;
          }

          if (type && mediaKey) {
            const stream = await downloadContentFromMessage(
              {
                mediaKey,
                directPath,
              },
              type,
              {}
            ).catch(errorHere => {
              console.error('🚨 Hay que debuguear esto: ¿Porqué falló el segundo intento de descarga del mensaje?')
              console.error(message.protoMessage)
              console.error(errorHere)
            });

            return stream;
          }


          console.error('🚨 Hay que debuguear esto: ¿Porqué no identificó el tipo de mensaje, que es este mensaje??')
          console.error(message.protoMessage)
          console.error('message:', message.protoMessage?.message)

          throw new Error(
            "Unable to identify message file to download from whatsapp"
          );
        } catch (err2) {
          console.error(err2);
          const errMsg =
            err2 instanceof Error
              ? err2.message
              : "Error desconocido al descargar un archivo desde whatsapp";
          throw new Error(errMsg);
        }
      }
    );

    if (!buffer) throw new Error("Unable to retreive buffer from file!");
    const mime =
      ctx?.message?.audioMessage?.mimetype ??
      ctx?.message?.imageMessage?.mimetype ??
      ctx?.message?.videoMessage?.mimetype ??
      ctx?.message?.stickerMessage?.mimetype ??
      ctx?.message?.documentMessage?.mimetype ??
      ctx.message?.documentWithCaptionMessage?.message?.documentMessage?.mimetype ??
      null;


    const caption =
      ctx?.message?.imageMessage?.caption ??
      ctx?.message?.videoMessage?.caption ??
      ctx?.message?.documentMessage?.caption ??
      ctx.message?.documentWithCaptionMessage?.message?.documentMessage?.caption ??
      null

    // save to file

    if (!existsSync(`${process.cwd()}/storage/tmp/`)) {
      mkdirSync(`${process.cwd()}/storage/tmp/`, { recursive: true })
    }

    const path = `${process.cwd()}/storage/tmp/${name ?? Math.random()
      }.${getExtensionFromMime(mime ?? "image/jpeg")}`;

    await writeFile(path, buffer).catch((error) => {
      console.error("Error saving file");
      throw error;
    });

    url.filePath = path;
    url.caption = caption;

    url.publicUrl = await uploadFile(path, `attachements/${message.accountId}/${message.id}/${(Math.random() * 100000).toFixed(0)}`) ?? undefined
    return url;
  } catch (err) {
    console.error(`${new Date()} - Error downloading file from whatsapp`);
    console.error(err);
    const url: MediaUrl = {
      type: message.messageType ?? 'chat',
      caption:
        "Error al intentar descargar un archivo desde whatsapp, formato incompatible.",
      errors: [err],
    };
    return url;
  }
}
