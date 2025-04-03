import type { Account } from '../types/mobile/mobile'
import { goto } from "$app/navigation";
import { page } from "$app/state";
import { apiRequest } from "$lib/ApiRequest.svelte";
import { auth } from "$lib/firebase";
import { getContext, setContext } from "svelte";
import { getToastState, ToastState } from '$lib/toast-state.svelte';
import type { User } from 'firebase/auth';

type AuthState = 'unknown-user'
    | 'email-known'
    | 'new-user'
    | 'authenticated'
    | null

class Session {
    state: AuthState = $state(null)
    email: string | null = $state(null)
    hasPassword?: boolean
    user = $state<User | null>(null)
    currentAccount = $state<string | null>(null)
    accounts = $state<Account[]>([])
    token = $state('')
    #toast?: ToastState
    #subscription?: () => void
    constructor() {
        $effect(() => {
            if (!this.#subscription) {
                this.#subscription = auth.onAuthStateChanged(user => this.setUser(user))
            }
            if (!this.#toast) this.#toast = getToastState()
        })
    }
    private async setUser(user: User | null) {
        if (!user) {
            this.state = 'unknown-user'
            if (page.route.id !== '/') goto('/')
        } else {
            if (page.route.id === '/') goto('/app')
            const response = await apiRequest('/auth/session')
                .catch(() => null);
            if (!response || response.status !== 200) {
                this.errorToast('No se pudo iniciar sesión en el servidor de la API de Asurandi.')
            }
            await this.getConfigInfo()
        }
        this.user = user
    }
    setUserEmail(email: string | null, hasPassword: boolean) {
        if (email) this.state = hasPassword ? 'email-known' : 'new-user'
        else this.state = 'unknown-user'

        this.hasPassword = hasPassword
        this.email = email
    }
    private async getConfigInfo() {
        const response = await apiRequest('/agent')
        const data = await response.json().catch(() => null)

        if (response.status !== 200) this.errorToast(data.message)
        if (!data) this.errorToast('No se pudo leer la respuesta del servidor al obtener los datos de la cuenta.')
        this.accounts = data.accounts
        this.currentAccount = data.currentAccount

    }
    private errorToast(message: string) {

        if (this.#toast) this.#toast.add(message,
            { type: 'error' })
    }
}


export function setSession() {
    return setContext('SESSION_KEY', new Session())
}

export function getSession() {
    return getContext<ReturnType<typeof setSession>>('SESSION_KEY')
}