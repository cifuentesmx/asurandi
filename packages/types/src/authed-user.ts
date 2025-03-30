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