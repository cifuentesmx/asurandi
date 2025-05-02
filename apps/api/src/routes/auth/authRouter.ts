import express, { Request, Response } from 'express';
import { getAuthEmail } from './getAuthEmail.js';
import { AppError } from 'src/lib/AppError.js';

const authRouter = express.Router();

authRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        console.log({ email });
        const response = await getAuthEmail(email);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor';
        return res.status(400).json({ message });
    }
});

export default authRouter;
// export const createProvider: AppRouteHandler<AuthCreateProvider> = async (c) => {
//     try {
//         const { email, password, name } = c.req.valid('json')
//         await createPasswordProvider({ email, password, name })
//         return c.json({ ok: true }, HttpStatusCodes.OK)
//     } catch (error) {
//         const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
//         if (error! instanceof AppError) c.var.logger.error(error)
//         return c.json({ message }, HttpStatusCodes.BAD_REQUEST)
//     }
// }

// export const getSession: AppRouteHandler<AuthGetSession> = async (c) => {
//     try {
//         const user = c.get('user')
//         if (!user) return c.json({ message: 'No has iniciado sesión' }, HttpStatusCodes.UNAUTHORIZED)
//         return c.json({}, HttpStatusCodes.OK)
//     } catch (error) {
//         const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor'
//         if (error! instanceof AppError) c.var.logger.error(error)
//         return c.json({ message }, HttpStatusCodes.UNAUTHORIZED)
//     }
// }

