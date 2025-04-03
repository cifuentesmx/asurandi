export type ListPolizaStatus = Awaited<ReturnType<typeof listPolizaStatus>>

export const listPolizaStatus = () => {
    return {
        polizaStatus: [
            { status: 'Emitida', id: 'Emitida' },
            { status: 'Pagada', id: 'Pagada' },
            { status: 'Por vencer', id: 'Por vencer' },
            { status: 'Cancelada', id: 'Cancelada' },
            { status: 'No renovada', id: 'No renovada' },
            { status: 'Renovada', id: 'Renovada' },
        ]
    }
}