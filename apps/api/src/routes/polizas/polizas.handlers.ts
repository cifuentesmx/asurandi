import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppRouteHandler } from "@asurandi/types"
import type { GetPoliza, SearchPoliza } from "./polizas.routes.js"
import { AppError } from "@/lib/AppError.js";
import { findPolizas } from './findPolizas.js';
import { getOne } from './getPoliza.js';

export const searchPoliza: AppRouteHandler<SearchPoliza> = async (c) => {
    try {
        const user = c.var.user
        if (!user) return c.json({ message: 'No has iniciado sesión' }, HttpStatusCodes.UNAUTHORIZED)
        const searchTxt = c.req.query('q')
        if (!searchTxt) throw new AppError("No se ha recibido el texto a buscar");

        const response = await findPolizas({ uid: user.uid, searchTxt })
        return c.json(response, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

export const getPoliza: AppRouteHandler<GetPoliza> = async (c) => {
    try {
        const user = c.var.user
        if (!user) return c.json({ message: 'No has iniciado sesión' }, HttpStatusCodes.UNAUTHORIZED)
        const { id } = c.req.valid('param')

        const response = await getOne({ uid: user.uid, id })
        if (!response) return c.json({}, HttpStatusCodes.NOT_FOUND)
        return c.json(response, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

