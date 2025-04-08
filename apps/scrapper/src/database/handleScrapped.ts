import { PolizasToScrapeFromDaily, ScrappedPolizaEvent } from "@asurandi/types";
import { qualitasScrappedFlota } from "./qualitas/qualitasScrappedFlota.js";
import { qualitasScrappedPoliza } from "./qualitas/qualitasScrappedPoliza.js";

export const handleScrapped = async (scrapped: ScrappedPolizaEvent, claveAgente: string, dataFromDailyScrapper: PolizasToScrapeFromDaily | undefined) => {
    if (scrapped.company === 'qualitas' && scrapped.type === 'individual') return await qualitasScrappedPoliza(scrapped, claveAgente, dataFromDailyScrapper)
    if (scrapped.company === 'qualitas' && scrapped.type === 'fleet') return await qualitasScrappedFlota(scrapped, claveAgente, dataFromDailyScrapper)
}