export const getReciboEstado = (estado: string): 'PAGADO' | 'PENDIENTE' | 'CANCELADO' | 'DESCONOCIDO' => {
    if (estado === 'PAGADO') return 'PAGADO'
    if (estado === 'Pagar en línea') return 'PENDIENTE'
    return 'DESCONOCIDO'
}