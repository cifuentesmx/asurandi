import { createRouter } from "../../lib/createApp.js";
import * as handlers from './polizas.handlers.js'
import * as routes from './polizas.routes.js'


const router = createRouter()
    .openapi(routes.searchPolizaRoute, handlers.searchPolizaHandler)
    .openapi(routes.getPolizaRoute, handlers.getPolizaHandler)
export default router