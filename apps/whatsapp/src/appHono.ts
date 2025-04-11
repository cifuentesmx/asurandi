import configureOpenAPI from './lib/configure-openapi.js'
import createApp from './lib/createApp.js'

const app = createApp()
const routes = [] as const
configureOpenAPI(app)
routes.forEach(route => {
    app.route('/v1', route)
})

export default app
