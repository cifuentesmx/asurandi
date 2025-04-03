import { serve } from '@hono/node-server'
import app from './appHono.js'
import env from './env.js'
import { initializeAdminApp } from './lib/firebase.server.js'
import { startCleanupFilesJob } from './cleanUpFilesTask.js'
import { ConnectionCluster } from './whatsappService/ConnectionCluster.js'

initializeAdminApp()
const cluster = new ConnectionCluster()
const jobInterval = startCleanupFilesJob()
serve({
    fetch: app.fetch,
    port: env.PORT,

}, (info) => {
    process.on('SIGTERM', () => gracefulShutdown());
    process.on('SIGINT', () => gracefulShutdown());
    // eslint-disable-next-line no-console
    console.log(`Server is running, find reference on http://localhost:${info.port}/reference`)
})

async function gracefulShutdown() {
    console.info(`${new Date()} - Received kill signal, shutting down gracefully`);
    if (jobInterval) {
      clearInterval(jobInterval);
    }
    console.info(`${new Date()} - Limpiando cluster de conexiones a whatsapp`);
    await cluster.destroy()
    setTimeout(() => {
        console.error(`${new Date()} - Could not close connections in time, forcefully shutting down'`);
        process.exit(1);
    }, 20_000);
    process.exit(0)
  }

