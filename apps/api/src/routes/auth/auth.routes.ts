import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ['Auth']

// verificar si tiene una cuenta y saber si puede iniciar sesión con correo
export type AuthGetEmail = typeof getEmail
const getEmailRequestSchema = z.object({ email: z.string().email() })
export const getEmail = createRoute({
    path: '/auth/email',
    tags,
    method: 'post',
    request: {
        body: jsonContentRequired(getEmailRequestSchema, 'El email con el cual se quiere crear una sesión en la API')
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                email: z.string().email(),
                hasPassword: z.boolean()
            }), 'El email validado como una cuenta existente y la existencia de un AUTH provider de contraseñas.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(getEmailRequestSchema), 'Validation errors')
    }
})

// Crear una cuenta de usuario en el sistema
export type AuthCreateProvider = typeof createProvider
const createProviderRequestSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
})
export const createProvider = createRoute({
    path: '/auth/provider',
    tags,
    method: 'post',
    request: {
        body: jsonContentRequired(createProviderRequestSchema, 'Crear auth provider con contraseña para que el usuario pueda iniciar sesión con contraseña.'),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(z.object({ ok: z.boolean() }), 'Confirmación de la creación del auth provider con contraseña.'),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            z.object({
                message: z.string()
            }), 'Ha ocurrido un error y no se pudo procesar la petición.'),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(createProviderRequestSchema), 'Validation errors')
    }
})


// Obtener la sesión actual en el sistema
export type AuthGetSession = typeof getSession
export const getSession = createRoute({
    path: '/auth/session',
    tags,
    method: 'get',
    // request: {
    //     headers: z.object({
    //         authorization: z.string().regex(/^Bearer .+$/i, 'Must be a Bearer token')
    //     })
    // },
    responses: {
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
            z.object({ message: z.string() }), 'El usuario no tiene una sesión activa.'),
        [HttpStatusCodes.OK]: jsonContent(z.object({}), 'El usuario está authentificado.')

    }
})

