
export type SaasUser = {
    id: string
    uid: string
    name: string
    email: string
    roles: SaasRole[]
    phone: string
    created?: number
    updated?: number
}

export type SaasRole = 'admin'
    | 'emisiones'
    | 'finanzas'
    | 'agente'
    | 'conducto'
    | 'user'
    | 'siniestros'