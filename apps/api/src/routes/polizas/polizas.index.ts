import { createRouter } from "@/lib/createApp.js";
import * as handlers from './polizas.handlers.js'
import * as routes from './polizas.routes.js'


const router = createRouter()
    .openapi(routes.searchPoliza, handlers.searchPoliza)
    .openapi(routes.getPoliza, handlers.getPoliza)
export default router