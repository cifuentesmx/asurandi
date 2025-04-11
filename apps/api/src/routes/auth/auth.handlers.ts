import type { AppRouteHandler } from "@asurandi/types";
import type { AuthCreateProvider, AuthGetEmail, AuthGetSession } from "./auth.routes.js";
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { getAuthEmail } from "./getAuthEmail.js";
import { AppError } from "../../lib/AppError.js";
import { createPasswordProvider } from "./createPasswordProvider.js";


export const getEmail: AppRouteHandler<AuthGetEmail> = async (c) => {
    try {
        const { email } = c.req.valid('json')
        const response = await getAuthEmail(email)
        return c.json(response, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

export const createProvider: AppRouteHandler<AuthCreateProvider> = async (c) => {
    try {
        const { email, password, name } = c.req.valid('json')
        await createPasswordProvider({ email, password, name })
        return c.json({ ok: true }, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

export const getSession: AppRouteHandler<AuthGetSession> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No has iniciado sesión' }, HttpStatusCodes.UNAUTHORIZED)
        return c.json({}, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.UNAUTHORIZED)
    }
}

