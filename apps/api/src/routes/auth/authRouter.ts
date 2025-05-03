import { Request, Response, Router } from 'express';
import { getAuthEmail } from './getAuthEmail.js';
import { AppError } from '../../lib/AppError.js';
import { z } from 'zod';
import { createPasswordProvider } from './createPasswordProvider.js';
const authRouter = Router();

authRouter.post('/email', async (req: Request, res: Response) => {
    try {

        const requestSchema = z.object({
            email: z.string().email()
        })
        const { email } = requestSchema.parse(req.body)
        const response = await getAuthEmail(email as string);
        res.status(200).send(JSON.stringify(response));
        return;
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).send(JSON.stringify({ error: error.flatten() }));
            return;
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor';
        res.status(400).send(JSON.stringify({ message }));
        return;
    }
});

authRouter.get('/session', async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json(JSON.stringify({ message: 'No has iniciado sesión' }))
        }
        res.status(200).send(JSON.stringify(req.user))
        return
    } catch (error) {
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        res.status(401).send(JSON.stringify({ message }))
        return
    }
});

authRouter.post('/provider', async (req: Request, res: Response) => {
    try {
        const requestSchema = z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string()
        })
        const { email, password, name } = requestSchema.parse(req.body)
        await createPasswordProvider({ email, password, name })
        res.status(200).json({ ok: true })
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).send(JSON.stringify({ error: error.flatten() }));
            return;
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
        res.status(400).send(JSON.stringify({ message }))
        return
    }
});

export default authRouter;
