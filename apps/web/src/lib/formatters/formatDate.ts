export const formatDate = (unixTimestamp?: number | Date | null, formatterOptions?: Intl.DateTimeFormatOptions) => {
    if (!unixTimestamp) return 'Fecha no registrada'
    if (unixTimestamp instanceof Date) unixTimestamp = unixTimestamp.getTime()
    const formatter = Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric', ...formatterOptions })
    return formatter.format(unixTimestamp ?? Date.now())
}

export const relativeDate = (unixTimestamp: number | Date) => {
    const date = unixTimestamp instanceof Date ? unixTimestamp : new Date(unixTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffDays / 30);

    if (diffMs < 60_000) {
        return `Hace unos momentos`;
    } else if (diffMins < 60) {
        return `Hace ${diffMins} minuto(s)`;
    } else if (diffHours < 24) {
        return `Hace ${diffHours} horas`;
    } else if (diffDays < 60) {
        return `Hace ${diffDays} días`;
    } else {
        return `Hace ${diffMonths} meses`;
    }
}