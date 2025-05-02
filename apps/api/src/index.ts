import { initializeAdminApp } from './lib/firebase.server.js'
import { createServer } from './app.js'

initializeAdminApp()
createServer()  
