import { goto } from "$app/navigation";
import { page } from "$app/state";
import { apiRequest } from "$lib/ApiRequest.svelte";
import { AppError } from "$lib/AppError";
import { getCookie, setCookie } from "$lib/cookies";
import { getToastState } from "$lib/toast-state.svelte"
import { getContext, setContext } from "svelte"
import type { GetOnePolizaResponse } from "../types/api/polizas";

type PolizaResult = unknown
type StoreStatus = 'idle' | 'searching' | 'search-result' | 'show-one' | 'not-found' | Error
const KEY = 'PolizasResult'

class PolizasResult {
    status: StoreStatus = $state('idle');
    searchedPolizas: PolizaResult[] = $state([])
    onePoliza: GetOnePolizaResponse | null = null
    total = $state(0)
    currentPage: number | null = $state(null)
    toast = getToastState()
    lastSearch = $state('')
    constructor() {
        const searchTxt = getCookie('poliza:searchTxt')
        if (searchTxt) this.lastSearch = searchTxt

        const status = getCookie('poliza:status') as StoreStatus
        if (status) this.status = status

        const total = Number(getCookie('poliza:total') ?? '0')
        if (total) this.total = total

        const searchedPolizas = JSON.parse(localStorage.getItem('searchedPolizas') ?? 'null')
        if (searchedPolizas) this.searchedPolizas = searchedPolizas

        const onePoliza = JSON.parse(localStorage.getItem('onePoliza') ?? 'null')
        if (onePoliza) this.onePoliza = onePoliza

        $effect(() => {
            if (!(this.status instanceof Error) && this.status !== 'searching') {
                setCookie('poliza:status', this.status)
            }
            setCookie('poliza:total', JSON.stringify(this.total))

            localStorage.setItem('searchedPolizas', JSON.stringify(this.searchedPolizas))
            localStorage.setItem('onePoliza', JSON.stringify(this.onePoliza))
        })
    }
    setResults(data?: { data?: PolizaResult[], total?: { count?: number } }) {
        if (!data?.data || !Array.isArray(data.data)) return this.notifyError('No se recibieron los resultados de la búsqueda')
        const total = data?.total?.count ?? 0
        this.searchedPolizas = data.data
        this.total = total
    }
    notifyError(msg: string) {
        this.toast.add(msg, { type: 'error' })
    }
    async search(searchTxt: string) {
        if (page.route.id !== '/app/polizas') goto('/app/polizas', { invalidateAll: true })
        setCookie('poliza:searchTxt', searchTxt)
        this.lastSearch = searchTxt
        this.status = 'searching';

        apiRequest(`/polizas?q=${searchTxt}`)
            .then(async (response) => {
                const data = await response.json().catch(() => {
                    throw new AppError('No se pudo leer la respuesta del servidor de la API de Asurandi');
                });

                if (!response.ok) {
                    if (response.status === 404)
                        throw new AppError(
                            'No se ha encontrado la ruta en el servidor para la consulta de pólizas.'
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
                        : 'Ha ocurrido un error inesperado al momento de realizar la búsqueda de las pólizas.';
                this.status = new Error(message);
            });

    }
    reset() {
        this.lastSearch = ''
        this.searchedPolizas = []
        this.status = 'idle'
        setCookie('poliza:searchTxt', '')
    }
    async getOne(polizaId: string) {
        this.status = 'searching'
        apiRequest(`/polizas/${polizaId}`)
            .then(async (r) => {
                if (r.status === 404) {
                    this.status = 'not-found';
                    return;
                }

                const data = await r.json().catch(() => null);
                if (!data) throw new AppError('No se pudo leer la respuesta del servidor.');
                this.onePoliza = data
                this.status = 'show-one';
            })
            .catch((e) => {
                this.status = e;
            });
    }
}


export const setPolizasStore = () => {
    return setContext(KEY, new PolizasResult())
}

export const getPolizasStore = () => {
    return getContext<ReturnType<typeof setPolizasStore>>(KEY)
}