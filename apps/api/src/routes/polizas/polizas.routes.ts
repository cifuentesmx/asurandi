import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { searchPolizaResponseSchema, getOnePolizaResponseSchema } from "@asurandi/types";

const tags = ['Polizas']

// buscar polizas
export type SearchPolizaRoute = typeof searchPolizaRoute

export const searchPolizaRoute = createRoute({
    path: '/polizas',
    tags,
    method: 'get',
    request: {
        query: z.object({
            q: z.string(),
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(20),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
            data: z.array(searchPolizaResponseSchema),
            total: z.object({ count: z.number() })
        }
        ), 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(searchPolizaResponseSchema), 'Validation errors')
    }
})

export type GetPolizaRoute = typeof getPolizaRoute
export const getPolizaRoute = createRoute({
    path: '/polizas/{id}',
    tags,
    method: 'get',
    request: {
        params: IdParamsSchema,
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(getOnePolizaResponseSchema, 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión.'),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(z.object({}), 'Poliza no encontrada.'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid ID error.')
    }
})

export type FindPolizasSiniestradasRoute = typeof findPolizasSiniestradasRoute
export const findPolizasSiniestradasRoute = createRoute({
    path: '/polizas-siniestradas',
    tags,
    method: 'get',
    request: {
        query: z.object({
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(200),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
            data: z.array(searchPolizaResponseSchema),
            total: z.object({ count: z.number() })
        }), 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(z.object({
            offset: z.coerce.number(), limit: z.coerce.number()
        })), 'Invalid query parameters.')
    }
})


export type FindPolizasNoRenovadasRoute = typeof findPolizasNoRenovadasRoute
export const findPolizasNoRenovadasRoute = createRoute({
    path: '/polizas-norenovadas',
    tags,
    method: 'get',
    request: {
        query: z.object({
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(200),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({
            data: z.array(searchPolizaResponseSchema),
            total: z.object({ count: z.number() })
        }), 'Resultados de búsqueda de las pólizas.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(z.object({
            offset: z.coerce.number(), limit: z.coerce.number()
        })), 'Invalid query parameters.')
    }
})
