import { goto } from "$app/navigation";
import { page } from "$app/state";
import { apiRequest } from "$lib/ApiRequest.svelte";
import { AppError } from "$lib/AppError";
import { getCookie, setCookie } from "$lib/cookies";
import { getToastState } from "$lib/toast-state.svelte"
import { getContext, setContext } from "svelte"

type ResultItem = unknown
type StoreStatus = 'idle' | 'searching' | Error | 'searching-more' | 'search-result' | 'show-one' | 'not-found'

const KEY = 'cobranzaResult'

class cobranzaStore {
    status: StoreStatus = $state('idle');
    items: ResultItem[] = $state([])
    selectedId: number | null = null
    total = $state(0)
    toast = getToastState()
    lastSearch = $state('')
    constructor() {
        const searchTxt = getCookie('cobranza:searchTxt')
        if (searchTxt) this.lastSearch = searchTxt

        const status = getCookie('cobranza:status') as StoreStatus
        if (status) this.status = status

        const total = Number(getCookie('cobranza:total') ?? '0')
        if (total) this.total = total

        const items = JSON.parse(localStorage.getItem('cobranza:items') ?? 'null')
        if (items) this.items = items

        $effect(() => {
            if (!(this.status instanceof Error) && this.status !== 'searching') {
                setCookie('cobranza:status', this.status)
            }
            setCookie('cobranza:total', JSON.stringify(this.total))

            localStorage.setItem('cobranza:items', JSON.stringify(this.items))
            localStorage.setItem('cobranza:selectedId', JSON.stringify(this.selectedId))
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
        if (page.route.id !== '/app/cobranza') goto('/app/cobranza', { invalidateAll: true })
        this.status = offset === 0 ? 'searching' : 'searching-more';

        apiRequest(`/cobranza?offset=${offset}`)
            .then(async (response) => {
                const data = await response.json().catch(() => {
                    throw new AppError('No se pudo leer la respuesta del servidor de la API de Asurandi');
                });

                if (!response.ok) {
                    if (response.status === 404)
                        throw new AppError(
                            'No se ha encontrado la ruta en el servidor para la consulta de cobranza.'
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
                        : 'Ha ocurrido un error inesperado al momento de realizar la búsqueda de la cobranza.';
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


export const getCobranzaStore = () => {
    const store = getContext<cobranzaStore>(KEY)
    if (!store) return setContext(KEY, new cobranzaStore())
    return store
}