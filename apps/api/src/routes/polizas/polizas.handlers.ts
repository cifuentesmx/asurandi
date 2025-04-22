import type { AppRouteHandler } from "@asurandi/types"
import type { GetPolizaRoute, SearchPolizaRoute } from "./polizas.routes.js"
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from "../../lib/AppError.js";
import { findPolizas } from './findPolizas.js';
import { getOne } from './getPoliza.js';

export const searchPolizaHandler: AppRouteHandler<SearchPolizaRoute> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No autorizado' }, HttpStatusCodes.UNAUTHORIZED)
        const { q } = c.req.valid('query')
        const result = await findPolizas({ uid: user.uid, searchTxt: q })
        return c.json(result, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

export const getPolizaHandler: AppRouteHandler<GetPolizaRoute> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No autorizado' }, HttpStatusCodes.UNAUTHORIZED)

        const { id } = c.req.valid('param')

        const result = await getOne({ uid: user.uid, id: Number(id) })
        return c.json(result, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
};

