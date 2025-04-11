import type { AppRouteHandler } from "@asurandi/types"
import type { GetPoliza, SearchPoliza } from "./polizas.routes.js"
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from "../../lib/AppError.js";
import { findPolizas } from './findPolizas.js';
import { getOne } from './getPoliza.js';

export const searchPoliza: AppRouteHandler<SearchPoliza> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No autorizado' }, HttpStatusCodes.UNAUTHORIZED)
        const { q } = c.req.valid('query')
        const response = await findPolizas({ uid: user.uid, searchTxt: q })
        return c.json(response, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

export const getPoliza: AppRouteHandler<GetPoliza> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No autorizado' }, HttpStatusCodes.UNAUTHORIZED)

        const { id } = c.req.valid('param')
        const saasId = c.req.header('x-saas-id')
        if (!saasId) {
            throw new AppError('SaasId no proporcionado')
        }

        const result = await getOne({ uid: saasId, id: Number(id) })
        return c.json(result, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
};

