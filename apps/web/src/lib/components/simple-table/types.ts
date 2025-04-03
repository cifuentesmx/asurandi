export type FilterOptions = {
    options?: {
        label: string,
        value: string | number
    }[],
    param: string
    type: 'combo' | 'dateInterval'
    caption: string
}[]


export type SelectedFilters = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}
export type SearchOptions = {
    options?: {
        label: string,
        value: string | number
    }[],
    param: string
    type: 'combo' | 'dateInterval' | 'text'
    caption: string
}[]

export type SelectedSearch = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}