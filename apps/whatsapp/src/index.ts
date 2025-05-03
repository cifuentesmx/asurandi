import env from './env.js'
import { initializeAdminApp } from './lib/firebase.server.js'
import { startCleanupFilesJob } from './cleanUpFilesTask.js'
import { ConnectionCluster } from './whatsappService/ConnectionCluster.js'
import express from 'express'
import { createServer } from 'node:http'

initializeAdminApp()
const cluster = new ConnectionCluster()
const jobInterval = startCleanupFilesJob()


const app = express()
const server = createServer(app)

app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

const port = env.PORT || 9988
server.listen(port, () => {
    console.log(`Whatsapp service listening on port ${port}`)
})

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)



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

