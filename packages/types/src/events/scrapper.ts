import { Aseguradoras } from '../company/index.js';
import type { ScrappedFlota } from '../qualitas/scrape-fleet.js';
import type { ScrappedPoliza } from '../qualitas/scrape-poliza.js';

let company: Aseguradoras

export type ScrappedPolizaEvent = {
    company: Aseguradoras
    type: 'individual' | 'fleet'
    saasId: string
    event: 'scrape.poliza'
    payload: ScrappedPoliza | ScrappedFlota
}