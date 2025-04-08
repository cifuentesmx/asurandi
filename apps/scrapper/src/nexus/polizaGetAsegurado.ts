import { NexusConnector } from "./connection.js";
import { eq, InferSelectModel } from "drizzle-orm";
import { nxPolizas } from "./polizas.js";
import { nxClientes } from "./clientes.js";

export const nexusGetAsegurado = async (numeroPoliza: string): Promise<InferSelectModel<typeof nxClientes> | null> => {
    const nexusConnection: NexusConnector = new NexusConnector()
    try {

        const nexus = await nexusConnection.connect()
        const polizas = await nexus.select()
            .from(nxPolizas)
            .where(
                eq(nxPolizas.poliza, numeroPoliza)
            )

        if (polizas.length > 0 && polizas[0]?.idCliente) {
            const clientes = await nexus.select().from(nxClientes).where(eq(nxClientes.idCliente, polizas[0].idCliente))
            if (clientes.length > 0) {
                return clientes[0]
            }
        }
        return null
    } catch (error) {
        console.error(error)
        throw new Error("Ocurrio un error al intentar buscar un agente en nexus");

    } finally {
        if (nexusConnection) nexusConnection.disconnect()
    }
}