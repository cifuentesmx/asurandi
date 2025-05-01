import { z } from "@hono/zod-openapi"
import { ManyItemsResponse } from "./index.js"

export type ListRenovacionesRespose = ManyItemsResponse<z.infer<typeof renovacionResponseSchema>>

export const renovacionResponseSchema = z.object({
    id: z.number(),
    saasId: z.string(),
    polizaId: z.number(),
    numeroPoliza: z.string(),
    asegurado: z.string(),
    agente: z.string(),
    conducto: z.string(),
    serie: z.string(),
    vehiculoId: z.number(),
    vehiculo: z.string(),
    vigenciaInicio: z.string(),
    vigenciaFin: z.string(),
    fechaVencimiento: z.string(),
    estado: z.string(),
    company: z.string(),
    created: z.string(),
})