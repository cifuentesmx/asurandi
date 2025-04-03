export const _upsert = <T>(array: T[], element: T, identificador?: keyof T): T[] => {
    if (!identificador) identificador = 'id' as keyof T
    const idx = array.findIndex(t => t[identificador] === element[identificador])
    if (idx !== -1) array[idx] = element
    else array.push(element)
    return array
}