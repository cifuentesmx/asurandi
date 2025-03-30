import type { QualitasScrappedFlota } from '../../qualitas/scrape-fleet.js';
import type { QualitasScrappedPoliza } from '../../qualitas/scrape-poliza.js';

export type ScrappedPolizaEvent = {
    company: 'qualitas'
    type: 'individual' | 'fleet'
    saasId: string
    event: 'scrape.poliza'
    payload: QualitasScrappedPoliza | QualitasScrappedFlota
}