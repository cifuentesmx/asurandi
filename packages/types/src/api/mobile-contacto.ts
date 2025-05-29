export type UpdateContactoRequest = {
    nombre?: string
    email?: string
    telefono?: string
    direccion?: string
    rfc?: string
    fechaNacimiento?: string
}

export type UpdateContactoResponse = {
    id: number
    nombre: string
    email: string | null
    telefono: string | null
    direccion: string | null
    ciudad: string | null
    pais: string | null
    rfc: string | null
    saasId: string | null

}

export type NewContactoRequest = {
    aseguradoId: number
    nombre: string
    email?: string
    telefono?: string
    direccion?: string
    rfc?: string
    fechaNacimiento?: string
}

export type NewContactoResponse = UpdateContactoResponse & {
    id: number
}