// import { HttpsProxyAgent } from 'https-proxy-agent';

import { deleteOldFilesAndDirectories } from "../../../lib/deleteOldFiles.js";
import type { ConnectedApp, SaasAccount, BotStatus } from "@asurandi/types";
import type { WhatsappMessage } from "../../../whatsappService/types.js";
import { Boom } from "@hapi/boom";
import { Browsers, DisconnectReason, makeWASocket, useMultiFileAuthState, type AnyMessageContent } from 'baileys';
import { pino } from "pino";
import { delay } from "../utils/delay.js";
import { baileysDownloadMediaFile } from "./baileysDownloadMediaFile.js";
import { baileysGenerateQR } from "./generateQR.js";
import { newWhatsappMessage } from "./newWhatsappMessage.js";

export const baileyesLogger = pino({ level: "fatal" });
// const agent = new HttpsProxyAgent('', {}) ?? undefined


export class BaileysProvider {
  id: number
  accountId: string;
  accountName: string
  account: SaasAccount
  socket?: ReturnType<typeof makeWASocket>
  state?: string;
  user?: unknown;
  shouldRestart = true
  statusUpdater: (status: BotStatus) => void
  incomingMessages: (messages: WhatsappMessage[]) => void
  connectedApp: ConnectedApp
  constructor(
    account: SaasAccount,
    accountName: string,
    statusUpdater: (status: BotStatus) => void,
    incomingMessages: (messages: WhatsappMessage[]) => void,
    connectedApp: ConnectedApp,
    id: number
  ) {
    this.id = id
    this.statusUpdater = statusUpdater
    this.connectedApp = connectedApp
    this.incomingMessages = incomingMessages
    this.accountId = account.id;
    this.account = account
    this.accountName = accountName
    this.statusUpdater('initializing')
    this.init();
  }

  async init() {
    try {
      const NAME_DIR_SESSION = `${process.cwd()}/storage/session/${this.accountId}/baileys`;
      const { state, saveCreds } = await useMultiFileAuthState(
        NAME_DIR_SESSION
      );

      this.socket = makeWASocket({
        browser: Browsers.windows("Desktop"),
        auth: state,
        logger: baileyesLogger,
        syncFullHistory: false,
        markOnlineOnConnect: false,
        // agent
      });

      this.socket.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

        /** Conexion cerrada por diferentes motivos */
        if (connection === "close") {


          const errorCode = (lastDisconnect?.error as Boom)?.output?.statusCode
          switch (errorCode) {

            case DisconnectReason.badSession:
              console.warn(`Sessión incorrecta, ${this.accountName} - statusCode: ${statusCode}`)
              break

            case DisconnectReason.connectionClosed:
              console.warn(`Se cerró la sesión, ${this.accountName} - statusCode: ${statusCode}`)
              break

            case DisconnectReason.connectionLost:
              console.warn(`Se perdió la conexión, ${this.accountName} - statusCode: ${statusCode}`)
              break

            case DisconnectReason.connectionReplaced:
              console.warn(`Conexión remplazada, ${this.accountName} - statusCode: ${statusCode}`)
              this.shouldRestart = false
              break

            case DisconnectReason.loggedOut:
              this.statusUpdater('closed')
              await deleteOldFilesAndDirectories(`${NAME_DIR_SESSION}`, 0)
              break

            case DisconnectReason.multideviceMismatch:
              console.warn(`Error en multidispositivo no concuerda, ${this.accountName} - statusCode: ${statusCode}`)
              break

            case DisconnectReason.restartRequired:
              console.warn(`Reinicio de conexión requerido, ${this.accountName} - statusCode: ${statusCode}`)
              break

            case DisconnectReason.forbidden:
              console.warn(`Estatus: Prohibido, ${this.accountName} - statusCode: ${statusCode}`)
              break

            case DisconnectReason.unavailableService:
              console.warn(`Servicio no disponible, ${this.accountName} - statusCode: ${statusCode}`)
              break
            default:
              break
          }

          if (this.shouldRestart) {
            console.warn(
              `Reiniciando la conexión con Whatsapp, ${this.accountName} - statusCode: ${statusCode}`
            );
            this.init();
          }
          else {
            console.warn(
              `Conexión con Whatsapp se ha cerrado, ${this.accountName} - statusCode: ${statusCode}`
            );
          }
        }

        /** Conexion abierta correctamente */
        if (connection === "open" && this.socket) {
          const parseNumber = `${this.socket.user?.id}`.split(":").shift();
          this.user = { ...this.socket.user, phone: parseNumber };
          this.statusUpdater('ready')

          this.socket.ev.on("messages.upsert", async (m) => {
            try {
              const msgs = newWhatsappMessage(m, this.account);
              this.incomingMessages(msgs)
            } catch (error) {
              console.error(`${new Date().toISOString()} - Error procesando mensajes: ${this.accountName}`)
              m.messages.forEach(mess => {
                console.error(m.type, mess.key)
              });
              console.error(error)
            }
          });
        }

        /** QR Code */
        if (qr) {
          await baileysGenerateQR(qr, this.accountId);
          this.statusUpdater('waiting-qr')
        }
      });

      this.socket.ev.on("creds.update", () => {
        // TODO future save creds to External FS
        saveCreds()
      });

      return
    } catch (error) {
      this.statusUpdater('error')
      return null;
    }
  }

  async sendMessage(msg: AnyMessageContent, jid: string) {
    try {
      if (!this.socket) return null;
      const inWhatsapp = await this.onWhatsApp(jid)
      console.log({ inWhatsapp })
      if (!inWhatsapp) return null

      await this.socket.presenceSubscribe(jid);
      await delay(300);
      if (Object.keys(msg).includes("text")) {
        await this.socket.sendPresenceUpdate("composing", jid);
        await delay(500);
      }
      await this.socket.sendPresenceUpdate("paused", jid);

      await this.socket.sendMessage(jid, msg);

      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async downloadMediaMessage(msg: WhatsappMessage) {
    return await baileysDownloadMediaFile(msg);
  }

  async onWhatsApp(jid: string) {
    const resp = await this.socket?.onWhatsApp(jid)
    return resp?.[0]?.exists ?? false
  }
  async stop() {
    return new Promise(async (resolve, reject) => {
      try {
        this.shouldRestart = false
        this.socket?.ev.removeAllListeners('messages.upsert')
        this.socket?.ev.removeAllListeners('connection.update')
        this.socket?.ev.removeAllListeners('creds.update')
        this.socket?.end(undefined)

        delete this.socket
        resolve
      } catch (error) {
        console.error(error)
        reject(`Error al intentar cerrar el socket con whatsapp cuenta: ${this.accountName}`)
      }

    })
  }
}
