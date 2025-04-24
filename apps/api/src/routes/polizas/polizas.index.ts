import { createRouter } from "../../lib/createApp.js";
import * as handlers from './polizas.handlers.js'
import * as routes from './polizas.routes.js'


const router = createRouter()
    .openapi(routes.searchPolizaRoute, handlers.searchPolizaHandler)
    .openapi(routes.getPolizaRoute, handlers.getPolizaHandler)
    .openapi(routes.findPolizasSiniestradasRoute, handlers.findPolizasSiniestradasHandler)
    .openapi(routes.findPolizasNoRenovadasRoute, handlers.findPolizasNoRenovadasHandler)
export default router