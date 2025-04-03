import configureOpenAPI from '@/lib/configure-openapi.js'
import createApp from '@/lib/createApp.js'
import auth from '@/routes/auth/auth.index.js'
import agent from '@/routes/agent/agent.index.js'
import polizas from '@/routes/polizas/polizas.index.js'

const app = createApp()
const routes = [
    auth,
    agent,
    polizas
]
configureOpenAPI(app)
routes.forEach(route => {
    app.route('/v1', route)
})

export default app
