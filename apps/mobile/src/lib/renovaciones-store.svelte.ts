import { goto } from "$app/navigation";
import { page } from "$app/state";
import { apiRequest } from "$lib/ApiRequest.svelte";
import { AppError } from "$lib/AppError";
import { getCookie, setCookie } from "$lib/cookies";
import { getToastState } from "$lib/toast-state.svelte"
import { getContext, setContext } from "svelte"
import { z } from "@hono/zod-openapi";
import { renovacionResponseSchema } from "@asurandi/types";

type ResultItem = z.infer<typeof renovacionResponseSchema>
type StoreStatus = 'idle' | 'searching' | Error | 'searching-more' | 'search-result' | 'show-one' | 'not-found'

const KEY = 'RenovacionesResult'

class RenovacionesStore {
    status: StoreStatus = $state('idle');
    items: ResultItem[] = $state([])
    selectedId: number | null = null
    total = $state(0)
    toast = getToastState()
    lastSearch = $state('')
    constructor() {
        const searchTxt = getCookie('renovacion:searchTxt')
        if (searchTxt) this.lastSearch = searchTxt

        const status = getCookie('renovacion:status') as StoreStatus
        if (status) this.status = status

        const total = Number(getCookie('renovacion:total') ?? '0')
        if (total) this.total = total

        const items = JSON.parse(localStorage.getItem('renovacion:items') ?? 'null')
        if (items) this.items = items

        $effect(() => {
            if (!(this.status instanceof Error) && this.status !== 'searching') {
                setCookie('renovacion:status', this.status)
            }
            setCookie('renovacion:total', JSON.stringify(this.total))

            localStorage.setItem('renovacion:items', JSON.stringify(this.items))
            localStorage.setItem('renovacion:selectedId', JSON.stringify(this.selectedId))
        })
    }
    setResults(data?: { data?: ResultItem[], total?: { count?: number } }) {
        if (!data?.data || !Array.isArray(data.data)) return this.notifyError('No se recibieron los resultados de la búsqueda')
        const total = data?.total?.count ?? 0
        this.total = total
        if (this.status === 'searching-more') {
            this.items = [...this.items, ...data.data]
            return
        }
        this.items = data.data
    }
    notifyError(msg: string) {
        this.toast.add(msg, { type: 'error' })
    }
    async fetch(offset = 0) {
        if (page.route.id !== '/app/renovaciones') goto('/app/renovaciones', { invalidateAll: true })
        this.status = offset === 0 ? 'searching' : 'searching-more';

        apiRequest(`/renovaciones?offset=${offset}`)
            .then(async (response) => {
                const data = await response.json().catch(() => {
                    throw new AppError('No se pudo leer la respuesta del servidor de la API de Asurandi');
                });

                if (!response.ok) {
                    if (response.status === 404)
                        throw new AppError(
                            'No se ha encontrado la ruta en el servidor para la consulta de renovaciones.'
                        );

                    throw new AppError(data.message);
                }
                this.setResults(data);
                this.status = 'search-result';
            })
            .catch((error) => {
                console.log(error);
                const message =
                    error instanceof AppError
                        ? error.message
                        : 'Ha ocurrido un error inesperado al momento de realizar la búsqueda de las renovaciones.';
                this.status = new Error(message);
            });

    }
    async fetchMore() {
        await this.fetch(this.items?.length ?? 0)
    }
    reset() {
        this.items = []
        this.status = 'idle'
    }
}


export const getRenovacionesStore = () => {
    const store = getContext<RenovacionesStore>(KEY)
    if (!store) return setContext(KEY, new RenovacionesStore())
    return store
}