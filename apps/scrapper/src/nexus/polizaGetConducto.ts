import { nxPolizas } from "./polizas";
import { NexusConnector } from "./connection";
import { eq } from "drizzle-orm";
import { nxConductos } from "./conductos";
import { nxUsuarios } from "./usuarios";
import { nxEmpleados } from "./empleados";

export const nexusGetConducto = async (numeroPoliza: string) => {
    const nexusConnection: NexusConnector = new NexusConnector()
    try {

        const nexus = await nexusConnection.connect()
        const [poliza] = await nexus.select()
            .from(nxPolizas)
            .where(
                eq(nxPolizas.poliza, numeroPoliza)
            ).limit(1)

        if (poliza?.idConducto) {
            const [conducto] = await nexus.select({
                idConducto: nxConductos.idConducto,
                nombre: nxEmpleados.nombre,
                email: nxEmpleados.email,
                tel: nxEmpleados.tel,
                cel: nxEmpleados.cel,

            })
                .from(nxConductos)
                .leftJoin(nxUsuarios, eq(nxUsuarios.idUsuario, nxConductos.idUsuario))
                .leftJoin(nxEmpleados, eq(nxEmpleados.idEmpleado, nxUsuarios.idEmpleado))
                .where(eq(nxConductos.idConducto, poliza.idConducto))
            return conducto
        }
        return null
    } catch (error) {
        console.error(error)
        throw new Error("Ocurrio un error al intentar buscar un agente en nexus");

    } finally {
        if (nexusConnection) nexusConnection.disconnect()
    }
}