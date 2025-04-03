import { PublicFileUrl } from "../saas/files.js"

export type SiniestroDetalle = {
    numeroReporte?: string
    fechaReporte?: string
    colonia?: string,
    comentarios?: string,
    causa?: string
    telefono?: string,
    conductor?: string
    ubicacion?: string
    ajustador?: {
        nombre?: string,
        llegada?: string,
        termino?: string,
    }
    involucrados?: {
        conductor?: string
        tipo_involucrado?: string
        folio_asignacion?: string
        proveedor?: string
    }[]

}

export type SiniestroActividad = {
    tipoActividad: 'Status' | 'Cierre'
    files?: PublicFileUrl[]
    comentario?: string
    user: string,
    timestamp: number
}
