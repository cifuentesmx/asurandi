import express from 'express';
import cors from 'cors';
import env from './env.js';
import { ApiAuthUser } from '@asurandi/types'
import { sessionCookieMiddleware } from './middlewares/authenticationMiddleware.js'
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


// Iniciar el servidor
export const createServer = () => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}
