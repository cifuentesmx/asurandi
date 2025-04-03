import { ScrappedPolizaEvent } from "@asurandi/types";
import { qualitasScrappedFlota } from "./qualitas/qualitasScrappedFlota.js";
import { qualitasScrappedPoliza } from "./qualitas/qualitasScrappedPoliza.js";

export const handleScrapped = async (scrapped: ScrappedPolizaEvent, claveAgente: string) => {
    if (scrapped.company === 'qualitas' && scrapped.type === 'individual') return await qualitasScrappedPoliza(scrapped, claveAgente)
    if (scrapped.company === 'qualitas' && scrapped.type === 'fleet') return await qualitasScrappedFlota(scrapped, claveAgente)
}