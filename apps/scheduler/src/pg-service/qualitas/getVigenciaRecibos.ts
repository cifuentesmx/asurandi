import { getFechaEmision } from "./getFechaEmision.js"

export const getVigenciaRecibo = (txt: string): (string | null)[] => {
    const strs = txt.replace('\n', '').split('Hasta')
    const inicio = strs[0]?.split('del ')[1]
    const fin = strs[1]?.split('del ')[1]

    return [getFechaEmision(inicio), getFechaEmision(fin)]
}