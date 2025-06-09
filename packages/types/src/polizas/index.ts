import { PublicFileUrl } from "../saas/files.js"

export type PolizaStatus = 'Emitida' | 'Pagada' | 'Por vencer' | 'Cancelada' | 'No renovada' | 'Renovada'

export type PolizaMetaData = Partial<{
    polizaPublicUrl: PublicFileUrl
    endososPublicUrl: PublicFileUrl[]
    anaseguros: {
        dataFromPdf: unknown
        dataFromScrapping: unknown
    }
}>