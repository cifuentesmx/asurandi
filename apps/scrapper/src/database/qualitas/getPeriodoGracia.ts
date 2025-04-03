export const getPeriodoGracia = (serialData: { key: string, value: string }[]): number => {
    let dias = 0
    const txt = serialData.find(t => t.key === 'Periodo de gracia')?.value?.split(' ')
    if (txt?.[1] === 'días') return Number(txt?.[0])
    return dias
}