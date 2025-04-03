
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

    export type AuthedUser = {
        uid: string;
        email?: string;
        emailVerified?: boolean;
        displayName?: string;
        photoURL?: string;
        phoneNumber?: string;
        disabled?: boolean;
        customClaims?: CustomClaims
    }
    
    export type CustomClaims = {
        roles?: string[]
        currentAccount?: string
        customerId?: string
        allowedAccounts?: string[]
        [key: string]: any;
    }