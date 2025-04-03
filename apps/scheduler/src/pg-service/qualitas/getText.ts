export const getText = (serialData: { key: string, value: string }[], id: string): string => {
    return serialData.find(t => t.key === id)?.value.trim().replace('\n', ' ') ?? ''
}