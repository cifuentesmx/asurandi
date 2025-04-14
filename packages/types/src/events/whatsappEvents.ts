import { PublicFileUrl } from "../saas/files.js"

export type OutgoingWhatsappMessageRequest = {
    saasId: string
    phoneNumber: string
    text?: string
    urls?: PublicFileUrl[]
}
