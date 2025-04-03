import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from "stoker/openapi/helpers";

const tags = ['Agent']

// verificar si tiene una cuenta y saber si puede iniciar sesión con correo
export type AgentsGet = typeof getAgent
export const getAgentResponseSchema = z.object({
    conductos: z.array(
        z.object(
            {
                id: z.number(),
                name: z.string()
            }
        ))
        .optional(),
    agentes: z.array(
        z.object(
            {
                id: z.number(),
                name: z.string()
            }
        ))
        .optional(),
    currentAccount: z.string(),
    accounts: z.array(z.object({
        id: z.string(),
        roles: z.array(z.string())
    })),

})
export const getAgent = createRoute({
    path: '/agent',
    tags,
    method: 'get',
    responses: {
        [HttpStatusCodes.OK]: jsonContent(getAgentResponseSchema, 'Se ha obtenido la información de los agentes y conductos asociados al email.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.object({ message: z.string() }), 'No se ha iniciado sesión')
    }
})

