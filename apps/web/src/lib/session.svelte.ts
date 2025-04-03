import { getContext, setContext } from "svelte";
import type { AuthedUser, SaasAccount } from "@asurandi/types";

const SESSION_KEY = Symbol('SESSION_KEY')

class Session {
    authedUser = $state<AuthedUser | null>(null)
    currentAccount = $state<SaasAccount | null>(null)
    saasId = $state<string | null>(null)
    constructor() { }

    setUser(user: AuthedUser | null) {
        this.authedUser = user
    }
    setCurrentAccount(currentAccount: SaasAccount | null) {
        this.currentAccount = currentAccount
        this.saasId = currentAccount?.id ?? null
    }
    async delete() {
        this.authedUser = null
        this.currentAccount = null
    }

}


export function setSession() {
    return setContext(SESSION_KEY, new Session())
}

export function getSession() {
    return getContext<ReturnType<typeof setSession>>(SESSION_KEY)
}