import { signOut } from 'firebase/auth';
import { AppError } from './AppError';
import { auth } from './firebase';
import { PUBLIC_ASURANDI_API_BASE_URL } from '$env/static/public';


let token: string
export const apiRequest = async (url: string | URL | Request, requestInit?: RequestInit) => {
    await auth.authStateReady()
    if (!auth.currentUser) await new Promise(resolve => setTimeout(resolve, 1500));
    if (!token) token = await auth.currentUser?.getIdToken(true) ?? ''
    const headers = new Headers(requestInit?.headers || {});
    const response = await fetch(`${PUBLIC_ASURANDI_API_BASE_URL}${url}`,
        {
            ...requestInit,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
    if (!response.ok) {
        if (response.status === 401) {
            // try to refresh a session
            token = await auth.currentUser?.getIdToken(true) ?? ''

            const retry = await fetch(`${PUBLIC_ASURANDI_API_BASE_URL}${url}`, requestInit)
            if (retry.status === 401) {
                await signOut(auth)
                throw new AppError("No se pudo obtener una sesión válida en el servidor de la API, reinténtalo o ponte en contacto con soporte técnico.");
            }
            return retry

        }
        return response
    }
    return response

}