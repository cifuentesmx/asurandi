import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from "stoker/openapi/helpers";
import { renovacionResponseSchema } from "@asurandi/types";
const tags = ['Renovaciones']

// buscar polizas
export type ListRenovacionesRoute = typeof listRenovacionesRoute

export const listRenovacionesRoute = createRoute({
    path: '/renovaciones',
    tags,
    method: 'get',
    request: {
        query: z.object({
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(150),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
            data: z.array(renovacionResponseSchema),
            total: z.object({ count: z.number() })
        }
        ), 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión'),
    }
})
