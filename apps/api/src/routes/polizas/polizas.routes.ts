import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

const tags = ['Polizas']

// verificar si tiene una cuenta y saber si puede iniciar sesión con correo
export type SearchPoliza = typeof searchPoliza
export const searchPolizaResponseSchema = z.object({
    data: z.object({}),
    total: z.object({ count: z.number() })
})
export const searchPoliza = createRoute({
    path: '/polizas',
    tags,
    method: 'get',
    request: {
        query: z.object({ q: z.string() }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(searchPolizaResponseSchema, 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión'),
        // [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(searchPolizaRequestSchema), 'Validation errors')
    }
})

export type GetPoliza = typeof getPoliza
export const getPolizaResponseSchema = z.object({

})
export const getPoliza = createRoute({
    path: '/polizas/{id}',
    tags,
    method: 'get',
    request: {
        params: IdParamsSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(getPolizaResponseSchema, 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión.'),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(z.object({}), 'Poliza no encontrada.'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid ID error.')
    }
})

