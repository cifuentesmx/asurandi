// import env from '../env.js'
// import { pino } from 'pino'
// import pretty from 'pino-pretty'

// export function logger(): ReturnType<typeof pinoLogger> {
//     return pinoLogger({
//         pino: pino({
//             level: env.LOG_LEVEL,
//         }, env.NODE_ENV === 'production' ? undefined : pretty()),
//         http: {
//             reqId: () => crypto.randomUUID(),
//         },
//     },
//     )
// }
