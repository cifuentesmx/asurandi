import { getNumberString } from "./getNumber.js"

export const getPrimaNetaComision = async (serialData: { key: string, value: string }[], porcentajeComision: string): Promise<string | null> => {
    const monto = parseFloat(getNumberString(serialData, 'Subtotal') ?? '0') - parseFloat(getNumberString(serialData, 'Expedición de póliza') ?? '0')
    return (monto * parseFloat(porcentajeComision) / 100).toFixed(2)

}