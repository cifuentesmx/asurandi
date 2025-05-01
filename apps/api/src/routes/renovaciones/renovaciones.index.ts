import { createRouter } from "../../lib/createApp.js";
import * as handlers from './renovaciones.handlers.js'
import * as routes from './renovaciones.routes.js'


const router = createRouter()
    .openapi(routes.listRenovacionesRoute, handlers.listRenovacionesHandler)
export default router