import { goto } from '$app/navigation';
import { error } from "@sveltejs/kit"
import { auth } from './firebase/app.client';

export const apiRequest = async (url: string | URL | Request, requestInit?: RequestInit) => {
    try {
        await auth.authStateReady()
        const response = await fetch(url, requestInit)
        if (!response.ok) {
            if (response.status === 401) {
                // try to refresh a session
                try {
                    const token = await auth.currentUser?.getIdToken(true)

                    const sessionRes = await fetch('/api/session', {
                        method: 'POST',
                        headers: new Headers({
                            Authorization: `Bearer ${token}`
                        })
                    })

                    if (sessionRes && sessionRes.ok) {
                        const retry = await fetch(url, requestInit)
                        return retry
                    }
                } catch {
                    goto('/login?session_closed=true')
                }
                goto('/login?session_closed=true')
            }
            return response
        }
        return response
    } catch {
        throw error(500, 'Error al intentar comunicarse con el servidor.')
    }
}