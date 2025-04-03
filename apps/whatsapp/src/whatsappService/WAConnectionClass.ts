import type { ConnectedApp, SaasAccount, BotStatus, OutgoingWhatsappMessageRequest } from "@asurandi/types";
import type { MediaUrl, WAProvider, WhatsappMessage } from "./types.ts";
import { AppError } from "@/lib/AppError.js";
import { BaileysProvider } from "./providers/Baileys/BaileysProvider.js";
import { statusUpdate } from "./statusUpdate.js";

const providers = [BaileysProvider, BaileysProvider];
export class WAConnection {
  id: number
  intent = 0;
  accountId: string;
  connectedApp?: ConnectedApp;
  accountName: string
  status: BotStatus;
  provider: WAProvider | null = null;
  account: SaasAccount
  constructor(account: SaasAccount, id: number) {
    this.id = id
    this.accountId = account.id;
    this.account = account
    this.connectedApp = account.connectedApp === 'asurandi' ? account.connectedApp : undefined
    this.accountName = account.name
    if (!this.connectedApp) {
      console.error(`Cuenta: ${account?.id ?? 'Sin ID de cuenta registrada'} No se ha podido detectar la aplicación conectada al proveedor de whatsapp.`)
      this.status = 'error'
    } else {
      this.status = "preinit";
      this.init()
    }
  }
  init() {
    console.info(
      `${this.id} - Intentando conexión con proveedor de Whatsapp para la cuenta ${this.accountName} - ${this.connectedApp}.`
    );
    const provider = providers[this.intent];
    if (!this.connectedApp) {
      this.status === 'error'
      return
    }

    this.provider = new provider(
      this.account,
      this.accountName,
      this.statusUpdated,
      this.incomingMessages,
      this.connectedApp,
      this.id
    );


  }
  async statusUpdated(status: BotStatus) {
    this.status = status;
    switch (status) {
      case 'closed':
        console.warn(`${new Date().toISOString()} - Se ha cerrado la conexión: ${this.id} - ${this.account.name}`)
        break;
      case 'error':
        console.warn(`${new Date().toISOString()} - Ha ocurrido un error en la conexión: ${this.id} - ${this.account.name}`)
        break;
      case 'initializing':
        console.warn(`${new Date().toISOString()} - Iniciando la conexión: ${this.id} - ${this.account.name}`)
        break;
      case 'preinit':
        console.warn(`${new Date().toISOString()} - Instancia de conexión se ha creado: ${this.id} - ${this.account.name}`)
        break;
      case 'ready':
        console.warn(`${new Date().toISOString()} - Conexión establecida correctamente: ${this.id} - ${this.account.name}`)
        break;
      case 'waiting-qr':
        console.warn(`${new Date().toISOString()} - Esperando el escaneo del QR: ${this.id} - ${this.account.name}`)
        break;

      default:
        break;
    }
    await statusUpdate(this.accountId, status)
    // if (status === "error") {
    //   this.intent++;
    //   this.init();
    // }
  }
  async incomingMessages(msg: WhatsappMessage[]): Promise<void> {
    // return new Promise((resolve, reject) => {
    //   if (this.connectedApp && this.downloadMediaMessage)
    //     setImmediate(async () => {
    //       try {
    //         resolve(await proceessIncomingWhatsappMessages({
    //           downloadMediaFn: this.downloadMediaMessage,
    //           messages: msg
    //         }))
    //       } catch (error) {
    //         console.error(`${new Date()} - Error procesando mensajes entrantes. Cuenta: ${this.accountName}, Mensajes: `)
    //         // msg.forEach(m => {
    //         //   console.error(m.id, m.protoMessage?.key)
    //         // });
    //         console.error(error)
    //         reject(error)
    //       }
    //     })
    // })
  }
  async downloadMediaMessage(msg: WhatsappMessage): Promise<MediaUrl> {
    if (!this.provider) throw new AppError("Unable to find provider to download media message");
    return await this.provider.downloadMediaMessage(msg);
  }
  async outgoingMessage(message: OutgoingWhatsappMessageRequest): Promise<void> {
    const cel = message.phoneNumber.replace(/\s|\D/g, '');
    const jid = cel?.length === 10 ? `521${cel}@s.whatsapp.net` : `${cel}@s.whatsapp.net`;

    if (message.text)
      this.provider?.sendMessage({ text: message.text }, jid)

  }
  async sendMessage(
    jid: string,
    message: unknown
  ) {
    console.log(jid, message)
    // return new Promise(async (resolve, reject) => {

    //   // If provider not connected
    //   if (!this.provider) return reject({ jid, msg: message });

    //   // If contact is not on whatsapp
    //   const exist = await this.provider.onWhatsApp(jid).catch(e => {
    //     console.error(`${new Date()} - No se pudo determinar si ${jid} está en whatsapp.`)
    //     console.error(e)
    //     return false
    //   }) ?? false
    //   if (!exist) {
    //     return reject({ jid, msg: message });
    //   }

    //   // Send actual message
    //   const res = await this.provider.sendMessage(message, jid);
    //   if (!res) {
    //     return reject({ jid, msg: message });
    //   }
    //   return resolve({ jid, msg: message });
    // });
  }
  stop() {
    if (!this.provider) return
    setImmediate(async () => {
      await this.statusUpdated('closed')

    })
    this.provider.stop()
    this.provider = null
    return true
  }
}
