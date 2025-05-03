import { Request, Response, Router } from 'express';
import { getAgentData } from './getAgentData.js';
import { AppError } from '../../lib/AppError.js';
const agentRouter = Router();

agentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado para acceder a este recurso' })
            return
        }
        const response = await getAgentData(user)
        res.status(200).json(response)
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        res.status(400).json({ message })
    }
});

export default agentRouter;