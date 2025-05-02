import express from 'express';
import cors from 'cors';
import { logger } from '../middlewares/pinoLogger.js';
import { sessionCookieMiddleware } from '../middlewares/authenticationMiddleware.js';

export function createRouter() {
    return express();
}

export default function createApp() {
    const app = createRouter();

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(logger());
    app.use(sessionCookieMiddleware());

    // Favicon
    app.get('/favicon.ico', (req, res) => {
        res.status(204).end();
    });

    // Error handling
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    return app;
}
