import type { AppRouteHandler } from "@asurandi/types"
import type { AgentsGet } from "./agent.routes.js"
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from "../../lib/AppError.js";
import { getAgentData } from './getAgentData.js';

export const getAgent: AppRouteHandler<AgentsGet> = async (c) => {
    try {
        const user = c.get('user')
        if (!user) return c.json({ message: 'No autorizado' }, HttpStatusCodes.UNAUTHORIZED)
        const response = await getAgentData(user)
        return c.json(response, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        if (error! instanceof AppError) c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

