import { Request, Response, Router } from 'express';
import { AppError } from '../../lib/AppError.js';
import { z } from 'zod';
import { listCobranza } from './listCobranza.js';

const cobranzaRouter = Router();

cobranzaRouter.get('/', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        const querySchema = z.object({
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(20),
        })
        const { offset, limit } = querySchema.parse(req.query)
        const result = await listCobranza({ uid: user.uid, offset, limit })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        res.status(400).json({ message })
        return
    }
});

export default cobranzaRouter;