import express from 'express';
import env from './env.js';
import cors from 'cors';
import { ApiAuthUser } from '@asurandi/types'
import { sessionCookieMiddleware } from './middlewares/authenticationMiddleware.js'

import authRouter from './routes/auth/authRouter.js';
import agentRouter from './routes/agent/agentRouter.js';
import polizasRouter from './routes/polizas/polizasRouter.js';
import renovacionesRouter from './routes/renovaciones/renovacionesRouter.js';
import cobranzaRouter from './routes/cobranza/cobranzaRouter.js';
declare global {
    namespace Express {
        interface Request {
            user?: ApiAuthUser
        }
    }
}

const port = env.PORT
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(sessionCookieMiddleware)

// Rutas
app.use('/v1/auth', authRouter);
app.use('/v1/agent', agentRouter);
app.use('/v1/polizas', polizasRouter);
app.use('/v1/renovaciones', renovacionesRouter);
app.use('/v1/cobranza', cobranzaRouter);

// Catch-all route for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        message: `No se encontró la ruta que está intentando acceder en el servidor de la API de Asurandi`,
    });
    return
});

// Iniciar el servidor
export const createServer = () => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}
