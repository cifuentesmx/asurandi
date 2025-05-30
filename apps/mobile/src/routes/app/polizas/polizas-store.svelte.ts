import { goto } from "$app/navigation";
import { page } from "$app/state";
import { apiRequest } from "$lib/ApiRequest.svelte";
import { AppError } from "$lib/AppError";
import { getCookie, setCookie } from "$lib/cookies";
import { getToastState } from "$lib/toast-state.svelte"
import type { GetOnePolizaResponse, searchPolizaResponseSchema, UpdateContactoRequest, NewContactoRequest } from "@asurandi/types";
import { getContext, setContext } from "svelte"
import { z } from "@hono/zod-openapi";

type PolizaResult = z.infer<typeof searchPolizaResponseSchema>
type StoreStatus = 'idle' | 'searching' | 'search-result' | 'show-one' | 'not-found' | Error | 'searching-more'
const KEY = 'PolizasResult'

class PolizasResult {
    status: StoreStatus = $state('idle');
    searchedPolizas: PolizaResult[] = $state([])
    onePoliza: GetOnePolizaResponse | null = null
    total = $state(0)
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
        this.total = total
        if (this.status === 'searching-more') {
            this.searchedPolizas = [...this.searchedPolizas, ...data.data]
            return
        }
        this.searchedPolizas = data.data
    }
    notifyError(msg: string) {
        this.toast.add(msg, { type: 'error' })
    }
    notifySuccess(msg: string) {
        this.toast.add(msg, { type: 'success' })
    }
    async search(searchTxt: string, offset = 0, url = '/polizas') {
        if (page.route.id !== '/app/polizas' || page.url.searchParams.get('consiniestros') !== 'true' || page.url.searchParams.get('newsearch') !== 'true') goto('/app/polizas', { invalidateAll: true })
        setCookie('poliza:searchTxt', searchTxt)
        this.lastSearch = searchTxt
        this.status = offset === 0 ? 'searching' : 'searching-more';

        apiRequest(`${url}?q=${searchTxt}&offset=${offset}`)
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
                const message =
                    error instanceof AppError
                        ? error.message
                        : 'Ha ocurrido un error inesperado al momento de realizar la búsqueda de las pólizas.';
                this.status = new Error(message);
            });

    }
    async searchSiniestros(offset = 0) {
        const searchTxt = 'Pólizas con siniestros'
        this.lastSearch = searchTxt
        this.search(searchTxt, offset, '/polizas/siniestradas')

    }
    async searchNoRenovadas(offset = 0) {
        const searchTxt = 'Pólizas no renovadas'
        this.lastSearch = searchTxt
        this.search(searchTxt, offset, '/polizas/norenovadas')
    }
    async searchMore() {
        if (this.lastSearch === 'Pólizas no renovadas') {
            this.searchNoRenovadas(this.searchedPolizas?.length ?? 0)
        } else if (this.lastSearch === 'Pólizas con siniestros') {
            this.searchSiniestros(this.searchedPolizas?.length ?? 0)
        } else {
            await this.search(this.lastSearch, this.searchedPolizas?.length ?? 0)
        }
    }
    reset() {
        this.lastSearch = ''
        this.searchedPolizas = []
        this.status = 'idle'
        setCookie('poliza:searchTxt', '')
    }
    async getOne(polizaId: string) {
        this.status = 'searching'
        await apiRequest(`/polizas/${polizaId}`)
            .then(async (r) => {
                if (r.status === 404) {
                    this.status = 'not-found';
                    return;
                }


                const data = await r.json().catch(() => null);
                if (!data) throw new Error('No se pudo leer la respuesta del servidor.');
                if (r.status === 400) {
                    this.status = new Error(data.message ?? 'Error inesperado en la API de asurandi.');
                    return;
                }
                this.onePoliza = data
                this.status = 'show-one';
            })
            .catch((e) => {
                this.status = e;
            });
    }
    async updateContacto(contactoId?: number, data?: UpdateContactoRequest): Promise<boolean> {
        if (!contactoId || !data) {
            this.toast.add('No se pudo actualizar el contacto', { type: 'error' })
            return false
        }
        return await apiRequest('/contactos/' + contactoId, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
            .then(async (res) => {
                const data = await res.json();

                if (res.ok) {
                    const contactoIndex = this.onePoliza?.contactos?.findIndex(c => c.id === contactoId)
                    if (contactoIndex && this.onePoliza && this.onePoliza.contactos) {
                        this.onePoliza.contactos[contactoIndex].ciudad = data.ciudad
                        this.onePoliza.contactos[contactoIndex].nombre = data.nombre
                        this.onePoliza.contactos[contactoIndex].rfc = data.rfc
                        this.onePoliza.contactos[contactoIndex].direccion = data.direccion
                        this.onePoliza.contactos[contactoIndex].telefono = data.telefono
                        this.onePoliza.contactos[contactoIndex].email = data.email

                        this.onePoliza = structuredClone(this.onePoliza)
                    }

                    this.getOne(this.onePoliza?.poliza?.id?.toString() ?? '0')
                    // TODO: recargar la página para que se actualice el contacto sin tener que hacer un getOne
                    this.notifySuccess('Contacto actualizado correctamente')

                    return true
                } else {
                    if (res.status === 401) {
                        throw new AppError("No tienes permisos para actualizar este contacto.");
                    } else if (res.status === 404 || res.status === 400) {
                        throw new AppError(data.message ?? 'Error inesperado en la API de asurandi.');
                    } else if (res.status === 422) {
                        throw new AppError('No se ha recibido correctamente la información del contacto. Revisa los datos e intenta nuevamente.');
                    } else {
                        throw new Error("Error al actualizar el contacto");
                    }
                }
            })
            .catch((error) => {
                const message = error instanceof AppError ? error.message : 'Ha ocurrido un error inesperado al momento de actualizar el contacto.'
                this.toast.add(message, { type: 'error' })
                return false
            })
    }
    async newContacto(data: NewContactoRequest): Promise<boolean> {
        return await apiRequest('/contactos', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    this.getOne(this.onePoliza?.poliza?.id?.toString() ?? '0')
                    this.notifySuccess('Contacto creado correctamente')
                    return true
                }
                if (res.status === 401) {
                    throw new AppError("No tienes permisos para crear un contacto.");
                } else if (res.status === 422) {
                    throw new AppError(data.message ?? 'No se ha recibido correctamente la información del contacto. Revisa los datos e intenta nuevamente.');
                } else {
                    throw new AppError(data.message ?? 'Error inesperado en la API de asurandi.');
                }
            })
            .catch((error) => {
                const message = error instanceof AppError ? error.message : 'Ha ocurrido un error inesperado al momento de crear el contacto.'
                this.notifyError(message)
                return false
            })
    }
}

export const getPolizasStore = () => {
    const store = getContext<PolizasResult>(KEY)
    if (!store) return setContext(KEY, new PolizasResult())
    return store
}