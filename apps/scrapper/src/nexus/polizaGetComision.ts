import { and, eq } from "drizzle-orm"
import { NexusConnector } from "./connection.js"
import { nxPolizas } from "./polizas.js"
import { nxRecibos } from "./recibos.js"

export const nexusGetComision = async (numeroPoliza: string): Promise<string | null> => {
    const nexusConnection: NexusConnector = new NexusConnector()
    try {

        const nexus = await nexusConnection.connect()
        const polizas = await nexus.select()
            .from(nxPolizas)
            .where(
                eq(nxPolizas.poliza, numeroPoliza)
            )

        if (polizas.length > 0 && polizas[0].idMovimiento) {
            const [recibo] = await nexus.select()
                .from(nxRecibos)
                .where(
                    and(
                        eq(nxRecibos.idMovimiento, polizas[0].idMovimiento),
                    )
                )
            return recibo?.comision as unknown as string ?? ((recibo?.comisionProducto ?? 0) / (recibo?.primaNeta ?? 1) * 100).toFixed(2)
        }
        return null
    } catch (error) {
        console.error(error)
        throw new Error("Ocurrio un error al intentar buscar la comisión de la poliza en nexus");

    } finally {
        if (nexusConnection) nexusConnection.disconnect()
    }
}