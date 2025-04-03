import { eq, InferSelectModel } from "drizzle-orm";
import { pgDb } from "../db.js";
import { tblAgentes } from "@asurandi/database"
import { nexusGetAgente } from "../../nexus/polizaGetAgente.js";

export const getAgente = async (
    serialData: { key: string, value: string }[],
    saasId: string,
): Promise<InferSelectModel<typeof tblAgentes>> => {

    const data = serialData.find(a => a.key === 'Agente')
    if (!data) throw new Error("No se pudo encontrar al agente en la cadena serializada de la poliza.");
    const agenteStr = data.value
    const [qualitasId, nombre] = agenteStr.split('-')
    const agentes = await pgDb.select().from(tblAgentes).where(eq(tblAgentes.qualitasId, qualitasId.trim()))

    if (agentes.length === 0) {
        const poliza = serialData.find(a => a.key === 'Número de póliza')
        let nexusId: number | null = null
        if (poliza?.value)
            nexusId = await nexusGetAgente(poliza.value.trim())

        const newAgente = await pgDb.insert(tblAgentes).values({
            nombre: nombre.trim(),
            alias: nombre.trim(),
            saasId,
            qualitasId: qualitasId.trim(),
            nexusId
        }).returning().catch(async () => {
            const retry = await pgDb.select().from(tblAgentes).where(eq(tblAgentes.qualitasId, qualitasId.trim()))
            return retry
        })
        return newAgente[0]
    } else {
        return agentes[0]
    }


}