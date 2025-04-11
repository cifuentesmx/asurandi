import { createRouter } from "../../lib/createApp.js";
import * as handlers from './auth.handlers.js'
import * as routes from './auth.routes.js'


const router = createRouter()
    .openapi(routes.getEmail, handlers.getEmail)
    .openapi(routes.createProvider, handlers.createProvider)
    .openapi(routes.getSession, handlers.getSession)

export default router