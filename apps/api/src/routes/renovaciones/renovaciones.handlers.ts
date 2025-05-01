import type { AppRouteHandler } from "@asurandi/types"
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from "../../lib/AppError.js";
import { listRenovaciones } from './listRenovaciones.js';
import { ListRenovacionesRoute } from "./renovaciones.routes.js";

export const listRenovacionesHandler: AppRouteHandler<ListRenovacionesRoute> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No autorizado' }, HttpStatusCodes.UNAUTHORIZED)
        const { offset, limit } = c.req.valid('query')
        const result = await listRenovaciones({ uid: user.uid, offset, limit })
        return c.json(result, HttpStatusCodes.OK)
    } catch (error) {
        console.log(error)
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

