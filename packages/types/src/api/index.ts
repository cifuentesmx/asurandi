export * from './mobile-polizas.js'
export * from './types.js'
export * from './poliza-siniestro-update-request.js'

export type ManyItemsResponse<T> = {
    data: Partial<T>[]
    total: {
        count?: number
    }
}