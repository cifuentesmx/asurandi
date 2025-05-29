import { goto } from "$app/navigation";
import { page } from "$app/state";
import { apiRequest } from "$lib/ApiRequest.svelte";
import { AppError } from "$lib/AppError";
import { getCookie, setCookie } from "$lib/cookies";
import { getToastState } from "$lib/toast-state.svelte"
import { getContext, setContext } from "svelte"

type ResultItem = {
    nombre: string
    telefono?: string | null
    email?: string | null
    direccion?: string | null
    fechaNacimiento?: string | null
    rfc?: string | null
    id: number
}
type StoreStatus = 'idle'
    | 'searching'
    | Error
    | 'searching-more'
    | 'search-result'
    | 'show-one'
    | 'not-found'

const KEY = 'contactosResult'

class ContactosStore {
    status: StoreStatus = $state('idle');
    items: ResultItem[] = $state([])
    selectedId: number
        | null = null
    total = $state(0)
    toast = getToastState()
    lastSearch = $state('')
    constructor() {
        const searchTxt = getCookie('contactos:searchTxt')
        if (searchTxt) this.lastSearch = searchTxt

        const status = getCookie('contactos:status') as StoreStatus
        if (status) this.status = status

        const total = Number(getCookie('contactos:total') ?? '0')
        if (total) this.total = total

        const items = JSON.parse(localStorage.getItem('contactos:items') ?? 'null')
        if (items) this.items = items

        $effect(() => {
            if (!(this.status instanceof Error) && this.status !== 'searching') {
                setCookie('contactos:status', this.status)
            }
            setCookie('contactos:total', JSON.stringify(this.total))

            localStorage.setItem('contactos:items', JSON.stringify(this.items))
            localStorage.setItem('contactos:selectedId', JSON.stringify(this.selectedId))
        })
    }
    setResults(data?: { data?: ResultItem[], total?: { count?: number } }) {
        if (!data?.data
            || !Array.isArray(data.data)) return this.notifyError('No se recibieron los resultados de la búsqueda')
        const total = data?.total?.count ?? 0
        this.total = total
        if (this.status === 'searching-more') {
            this.items = [...this.items, ...data.data]
            return
        }
        this.items = data.data
    }
    async search(searchTxt: string) {
        this.lastSearch = searchTxt
        await this.fetch(searchTxt)
    }
    async searchBirthdays(offset = 0) {
        this.lastSearch = 'Cumpleañeros'
        this.fetch(this.lastSearch, offset, '/contactos/bday')
    }
    async searchWoBirthdays(offset = 0) {
        this.lastSearch = 'Sin cumpleaños registrados'
        this.fetch(this.lastSearch, offset, '/contactos/wobday')
    }
    async searchWoPhone(offset = 0) {
        this.lastSearch = 'Sin teléfono registrado'
        this.fetch(this.lastSearch, offset, '/contactos/wophone')
    }
    notifyError(msg: string) {
        this.toast.add(msg, { type: 'error' })
    }
    async fetch(searchTxt: string, offset = 0, url = '/contactos') {
        if (page.route.id !== '/app/contactos') goto('/app/contactos', { invalidateAll: true })
        this.status = offset === 0 ? 'searching' : 'searching-more';

        apiRequest(`${url}?offset=${offset}&search=${searchTxt}`)
            .then(async (response) => {
                const data = await response.json().catch(() => {
                    throw new AppError('No se pudo leer la respuesta del servidor de la API de Asurandi');
                });

                if (!response.ok) {
                    if (response.status === 404)
                        throw new AppError(
                            'No se ha encontrado la ruta en el servidor para la consulta de contactos.'
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
                        : 'Ha ocurrido un error inesperado al momento de realizar la búsqueda de la contactos.';
                this.status = new Error(message);
            });

    }
    async fetchMore() {
        if (this.lastSearch === 'Cumpleañeros') {
            await this.searchBirthdays(this.items?.length ?? 0)
        } else if (this.lastSearch === 'Sin cumpleaños registrados') {
            await this.searchWoBirthdays(this.items?.length ?? 0)
        } else if (this.lastSearch === 'Sin teléfono registrado') {
            await this.searchWoPhone(this.items?.length ?? 0)
        } else {
            await this.fetch(this.lastSearch, this.items?.length ?? 0)
        }
    }
    reset() {
        this.items = []
        this.status = 'idle'
    }
    async updateContacto(id: number, contacto: ResultItem) {
        console.log(contacto)
        const result = await apiRequest(`/contactos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                nombre: contacto.nombre ?? undefined,
                telefono: contacto.telefono ?? undefined,
                email: contacto.email ?? undefined,
                direccion: contacto.direccion ?? undefined,
                fechaNacimiento: contacto.fechaNacimiento ?? undefined,
                rfc: contacto.rfc ?? undefined
            })
        })
        return result.json()
    }
    editOne(id: number) {
        goto(`/app/contactos/${id}`)
    }
}


export const getContactosStore = () => {
    const store = getContext<ContactosStore>(KEY)
    if (!store) return setContext(KEY, new ContactosStore())
    return store
}