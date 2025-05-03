import { Request, Response, Router } from 'express';
import { AppError } from '../../lib/AppError.js';
import { z } from 'zod';
import { findPolizas } from './findPolizas.js';
import { findPolizasSiniestradas } from './findPolizasSiniestradas.js';
import { findPolizasNoRenovadas } from './findPolizasNoRenovadas.js';
import { getOne } from './getPoliza.js';

const agentRouter = Router();

agentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        const querySchema = z.object({
            q: z.string(),
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(20),
        })
        const { q, offset, limit } = querySchema.parse(req.query)

        const result = await findPolizas({ uid: user.uid, searchTxt: q, offset, limit })
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

agentRouter.get('/siniestradas', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        const querySchema = z.object({
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(80),
        })
        const { offset, limit } = querySchema.parse(req.query)

        const result = await findPolizasSiniestradas({ uid: user.uid, offset, limit })
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

agentRouter.get('/norenovadas', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        const querySchema = z.object({
            offset: z.coerce.number().optional().default(0),
            limit: z.coerce.number().optional().default(80),
        })
        const { offset, limit } = querySchema.parse(req.query)

        const result = await findPolizasNoRenovadas({ uid: user.uid, offset, limit })
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

agentRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        const paramsSchema = z.object({
            id: z.coerce.number()
        })
        const { id } = paramsSchema.parse(req.params)


        const result = await getOne({ uid: user.uid, id })
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

export default agentRouter;