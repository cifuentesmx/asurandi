export const extractCleanNumber = (text: string) => {
    return text.replace(/[^0-9.-]/g, '')
}