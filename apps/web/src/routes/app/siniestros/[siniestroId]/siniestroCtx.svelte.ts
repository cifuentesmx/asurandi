import type { GetSiniestro } from "$api/siniestros/getSiniestro";
import { getContext, setContext } from "svelte";
import type { SiniestroActividad } from "../../../../database/schema/siniestros";
import { AppError } from "$lib/ApplicationError";

export class SiniestroCtx {
    value = $state<GetSiniestro | undefined>()
    actividades = $state<SiniestroActividad[]>([])
    set(siniestro: GetSiniestro) {
        this.value = siniestro
        this.actividades = siniestro.actividades ?? []
    }
    addActividad(actividad: SiniestroActividad) {
        if (this.actividades) {
            this.actividades.unshift(actividad)
        } else {
            this.actividades = [actividad]
        }
    }
    close(actividad: SiniestroActividad) {
        if (!this.value) throw new AppError('No se han cargado los datos del siniestro previamente.');
        this.addActividad(actividad)
        this.value.fechaCierre = new Date().toString()
    }
}
const KEY = Symbol('SINIESTRO_KEY')
export function setSiniestroCtx() {
    return setContext(KEY, new SiniestroCtx())
}
export function getSiniestroCtx() {
    return getContext<ReturnType<typeof setSiniestroCtx>>(KEY)
}