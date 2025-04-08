import { nxPolizas } from "./polizas.js";
import { NexusConnector } from "./connection.js";
import { eq } from "drizzle-orm";

export const nexusGetAgente = async (numeroPoliza: string): Promise<number | null> => {
    const nexusConnection: NexusConnector = new NexusConnector()
    try {

        const nexus = await nexusConnection.connect()
        const polizas = await nexus.select()
            .from(nxPolizas)
            .where(
                eq(nxPolizas.poliza, numeroPoliza)
            )

        if (polizas.length > 0) {
            return polizas[0].idAgente
        }
        return null
    } catch (error) {
        console.error(error)
        throw new Error("Ocurrio un error al intentar buscar un agente en nexus");

    } finally {
        if (nexusConnection) nexusConnection.disconnect()
    }
}