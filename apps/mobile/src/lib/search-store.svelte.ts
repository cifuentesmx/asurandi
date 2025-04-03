import { getContext, setContext } from "svelte"
const KEY = 'SuperSearchResult'

class SuperSearch {
    status: 'idle' | 'loading' | Error = $state('idle');
    focused = $state(false)
    disabled = $state(false)
    value: string = $state('')
    searchFn: ((searchStr: string) => Promise<void>) | null = $state(null)
    constructor() {
    }

}


export const setSearchStore = () => {
    return setContext(KEY, new SuperSearch())
}

export const getSearchStore = () => {
    return getContext<ReturnType<typeof setSearchStore>>(KEY)
}