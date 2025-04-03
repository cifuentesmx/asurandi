import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppRouteHandler } from "@/types/api/types.js"
import type { AgentsGet } from "./agent.routes.js"
import { AppError } from "@/lib/AppError.js";
import { getAgentData } from './getAgentData.js';

export const getAgent: AppRouteHandler<AgentsGet> = async (c) => {
    try {
        const user = c.var.user
        if (!user) return c.json({ message: 'No has iniciado sesión' }, HttpStatusCodes.UNAUTHORIZED)
        const response = await getAgentData(user)
        return c.json(response, HttpStatusCodes.OK)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        c.var.logger.error(error)
        return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
    }
}

