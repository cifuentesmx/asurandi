export const getNumber = (data: { key: string, value: string }[] | string, name?: string): number[] => {
    const str = typeof data === 'string' ? data : data.find(t => t.key === name)?.value ?? '0'
    const coincidencias = str.match(/(-?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)/g)
    return coincidencias ? coincidencias.map(num => parseFloat(num.replace(/,/g, ''))) : [];
}

export const getNumberString = (data: { key: string, value: string }[] | string, name?: string): string | null => {

    const str = typeof data === 'string' ? data : data.find(t => t.key === name)?.value ?? '0'
    const coincidencias = str.match(/(-?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)/)
    return coincidencias?.[0].replace(/,/g, '') ?? null
}
