import { config } from "dotenv";
config();

export const RABBIT_CONECCTION_STRING = process.env.RABBIT_CONECCTION_STRING ?? ''

export const PORT = Number(process.env.PORT ?? "3000");

export const MAX_INTENTS = Number(process.env.MAX_INTENTS ?? '3')

export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? ''
export const FIREBASE_ADMIN_CLIENT_EMAIL = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? ''
export const FIREBASE_ADMIN_PRIVATE_KEY = process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? ''
export const FIREBASE_CONNECT_EMULATORS = process.env.FIREBASE_CONNECT_EMULATORS ?? ''
export const NEXUS_HOST = process.env.NEXUS_HOST ?? ''
export const NEXUS_PASSWORD = process.env.NEXUS_PASSWORD ?? ''
export const RABBIT_PREFETCH = Number(process.env.RABBIT_PREFETCH ?? '1')