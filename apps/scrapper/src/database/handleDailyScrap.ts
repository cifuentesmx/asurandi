import { QualitasScrappedDailyStats } from "@asurandi/types"
import { qualitasCanceladas } from "./qualitas/qualitasCanceladas.js"
import { qualitasNoRenovadas } from "./qualitas/qualitasNoRenovadas.js"
import { qualitasPagadas } from "./qualitas/qualitasPagadas.js"
import { qualitasPorCobrar } from "./qualitas/qualitasPorCobrar.js"
import { qualitasPorRenovar } from "./qualitas/qualitasPorRenovar.js"
import { qualitasPorVencer } from "./qualitas/qualitasPorVencer.js"
import { qualitasRenovadas } from "./qualitas/qualitasRenovadas.js"

export const handleDailyScrap = async (payload: QualitasScrappedDailyStats, saasId: string): Promise<void> => {
    if (payload.canceladas) await qualitasCanceladas(payload.canceladas)
    if (payload.noRenovadas) await qualitasNoRenovadas(payload.noRenovadas)
    if (payload.pagadas) await qualitasPagadas(payload.pagadas)
    if (payload.porVencer) await qualitasPorVencer(payload.porVencer)
    if (payload.renovadas) await qualitasRenovadas(payload.renovadas)
    if (payload.porRenovar) await qualitasPorRenovar(payload.porRenovar, saasId)
    if (payload.porCobrar) await qualitasPorCobrar(payload.porCobrar, saasId)
    return
}