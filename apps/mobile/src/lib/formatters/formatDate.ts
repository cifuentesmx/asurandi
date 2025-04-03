export const formatDate = (unixTimestamp?: number | Date | null, formatterOptions?: Intl.DateTimeFormatOptions) => {
    if (!unixTimestamp) return 'Fecha no registrada'
    if (unixTimestamp instanceof Date) unixTimestamp = unixTimestamp.getTime()
    const formatter = Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric', ...formatterOptions })
    return formatter.format(unixTimestamp ?? Date.now())
}