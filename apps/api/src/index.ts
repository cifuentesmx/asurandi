import { serve } from '@hono/node-server'
import app from './app.js'
import env from './env.js'
import { initializeAdminApp } from './lib/firebase.server.js'

initializeAdminApp()
serve({
    fetch: app.fetch,
    port: env.PORT,

}, (info) => {
    // eslint-disable-next-line no-console
    console.log(`Server is running, find reference on http://localhost:${info.port}/reference`)
})
