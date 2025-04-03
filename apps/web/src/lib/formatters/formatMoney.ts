export const formatMoney = (value?: string | number | null, currency?: string) => {

    if (!value) return ''
    if (typeof value === 'string') value = Number(value)
    if (Number.isNaN(value)) return '-'
    const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency ?? 'MXN' })
    return fmt.format(value)
}

