import { Request, Response, Router } from 'express';
import { AppError } from '../../lib/AppError.js';
import { z } from 'zod';
import { updateContacto } from './updateContacto.js';
import { newContacto } from './createContacto.js';
import { dev } from 'src/env.js';
import { searchContactos } from './searchContactos.js';
import { searchCumpleanos } from './searchCumpleanos.js';
import { searchSinCumpleanos } from './searchSinCumpleanos.js';
import { searchSinTelefono } from './searchSinTelefono.js';
const contactosRouter = Router();

contactosRouter.get('/', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        if (!user.saasId) {
            res.status(400).json({ message: 'No se pudo obtener el ID de la cuenta del usuario' })
            return
        }
        const querySchema = z.object({
            search: z.string(),
            limit: z.coerce.number().default(40),
            offset: z.coerce.number().default(0),
        })
        const { search, limit, offset } = querySchema.parse(req.query)
        const result = await searchContactos({ search, limit, offset, saasId: user.saasId, uid: user.uid })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor al buscar contactos'
        res.status(400).json({ message })
        return
    }
});
contactosRouter.get('/bday', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        if (!user.saasId) {
            res.status(400).json({ message: 'No se pudo obtener el ID de la cuenta del usuario' })
            return
        }
        const querySchema = z.object({
            limit: z.coerce.number().default(40),
            offset: z.coerce.number().default(0),
        })
        const { limit, offset } = querySchema.parse(req.query)
        const result = await searchCumpleanos({ limit, offset, saasId: user.saasId, uid: user.uid })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor al buscar contactos'
        res.status(400).json({ message })
        return
    }
});
contactosRouter.get('/wobday', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        if (!user.saasId) {
            res.status(400).json({ message: 'No se pudo obtener el ID de la cuenta del usuario' })
            return
        }
        const querySchema = z.object({
            limit: z.coerce.number().default(40),
            offset: z.coerce.number().default(0),
        })
        const { limit, offset } = querySchema.parse(req.query)
        const result = await searchSinCumpleanos({ limit, offset, saasId: user.saasId, uid: user.uid })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor al buscar contactos'
        res.status(400).json({ message })
        return
    }
});
contactosRouter.get('/wophone', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        if (!user.saasId) {
            res.status(400).json({ message: 'No se pudo obtener el ID de la cuenta del usuario' })
            return
        }
        const querySchema = z.object({
            limit: z.coerce.number().default(40),
            offset: z.coerce.number().default(0),
        })
        const { limit, offset } = querySchema.parse(req.query)
        const result = await searchSinTelefono({ limit, offset, saasId: user.saasId, uid: user.uid })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor al buscar contactos'
        res.status(400).json({ message })
        return
    }
});


contactosRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        if (!user.saasId) {
            res.status(400).json({ message: 'No se pudo obtener el ID de la cuenta del usuario' })
            return
        }
        const querySchema = z.object({
            nombre: z.string().min(1, 'El nombre es requerido'),
            email: z.string().optional(),
            telefono: z.string().optional(),
            direccion: z.string().optional(),
            rfc: z.string().optional(),
            fechaNacimiento: z.string().optional(),
        })
        const { nombre, email, telefono, direccion, rfc, fechaNacimiento } = querySchema.parse(req.body)
        const id = z.coerce.number().parse(req.params.id)
        const result = await updateContacto({ id, nombre, email, telefono, direccion, rfc, fechaNacimiento, saasId: user.saasId, uid: user.uid })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor al actualizar el contacto'
        res.status(400).json({ message, details: dev ? error : null })
        return
    }
});

contactosRouter.post('/', async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).json({ message: 'No autorizado' })
            return
        }
        if (!user.saasId) {
            res.status(400).json({ message: 'No se pudo obtener el ID de la cuenta del usuario' })
            return
        }
        const querySchema = z.object({
            nombre: z.string().min(1, 'El nombre es requerido'),
            email: z.string().optional(),
            telefono: z.string().optional(),
            direccion: z.string().optional(),
            rfc: z.string().optional(),
            fechaNacimiento: z.string().optional(),
            aseguradoId: z.coerce.number(),
        })
        const { nombre, email, telefono, direccion, rfc, fechaNacimiento, aseguradoId } = querySchema.parse(req.body)
        const result = await newContacto({
            nombre, email, telefono, direccion, rfc, fechaNacimiento, aseguradoId,
            saasId: user.saasId, uid: user.uid
        })
        res.status(200).json(result)
        return
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({ error: error.flatten() })
            return
        }
        const message = error instanceof AppError ? error.message : 'Error inesperado en el servidor al crear el contacto'
        res.status(400).json({ message })
        return
    }
});


export default contactosRouter;