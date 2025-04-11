import { createRouter } from "../../lib/createApp.js";
import * as handlers from './agent.handlers.js'
import * as routes from './agent.routes.js'


const router = createRouter()
    .openapi(routes.getAgent, handlers.getAgent)

export default router