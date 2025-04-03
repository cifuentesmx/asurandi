import { eq, InferSelectModel, sql } from "drizzle-orm";
import { pgDb } from "../db.js";
import { aseguradosToContactos, tblAsegurados, tblContactos } from "@asurandi/database";

import { nexusGetAsegurado } from "../../nexus/polizaGetAsegurado.js";
import { nxClientes } from "../../nexus/clientes.js";

export const getAsegurado = async (
    serialData: { key: string, value: string }[],
    saasId: string,
    agenteId: number | null,
    conductoId: number | null
): Promise<InferSelectModel<typeof tblAsegurados>> => {


    const data = serialData.find(a => a.key === 'Número de asegurado')
    if (!data) throw new Error("No se pudo encontrar al numero de asegurado en la cadena serializada de la poliza.");
    const numeroAsegurado = data.value.trim()
    const asegurados = await pgDb.select().from(tblAsegurados).where(eq(tblAsegurados.qualitasId, numeroAsegurado))
    const nombre = serialData.find(a => a.key === 'Asegurado')
    const celular = serialData.find(a => a.key === 'Telefono celular del asegurado')
    const direccion = serialData.find(a => a.key === 'Dirección')
    const rfc = serialData.find(a => a.key === 'RFC')


    if (asegurados.length === 0) {
        const poliza = serialData.find(a => a.key === 'Número de póliza')
        let nexusClient: InferSelectModel<typeof nxClientes> | null = null
        if (poliza?.value)
            nexusClient = await nexusGetAsegurado(poliza.value.trim()) as InferSelectModel<typeof nxClientes> | null



        const newAsegurado = await pgDb.insert(tblAsegurados).values({
            saasId,
            nombre: nombre?.value?.trim() ?? nexusClient?.cliente?.trim() ?? 'Desconocido',
            nexusId: nexusClient?.idCliente,
            email: nexusClient?.email,
            celular: celular?.value.trim() ?? nexusClient?.celular?.trim(),
            direccion: direccion?.value.trim() ?? nexusClient?.direccion?.trim(),
            qualitasId: numeroAsegurado,
            rfc: rfc?.value.trim() ?? nexusClient?.RFC?.trim(),
        }).returning()
            .catch(async (e) => {
                console.error('No se pudo insertar', e)
                return await pgDb.select().from(tblAsegurados).where(eq(tblAsegurados.qualitasId, numeroAsegurado))
            })

        const newContacto = await pgDb.insert(tblContactos).values({
            saasId,
            nombre: nexusClient?.cliente?.trim() ?? 'Desconocido',
            email: nexusClient?.email?.trim() ?? 'Desconocido',
            rfc: nexusClient?.RFC?.trim(),
            direccion: nexusClient?.direccion?.trim(),
            agenteId,
            conductoId,
            esCliente: true,
            fechaActualizacion: sql`NOW()`,
            telefono: nexusClient?.telefono ?? nexusClient?.telefono2 ?? nexusClient?.telefono3,
        }).returning()
        if (newContacto.length === 1 && newAsegurado.length === 1) {
            await pgDb.insert(aseguradosToContactos).values({
                aseguradoId: newAsegurado[0].id,
                contactoId: newContacto[0].id
            })
        }

        return newAsegurado[0]
    } else {
        await pgDb.update(tblAsegurados).set({
            saasId,
            nombre: nombre?.value?.trim() ?? 'Desconocido',
            celular: celular?.value.trim(),
            direccion: direccion?.value.trim(),
            qualitasId: numeroAsegurado,
            rfc: rfc?.value.trim(),
        }).where(eq(tblAsegurados.id, asegurados[0].id))
        return asegurados[0]
    }


}