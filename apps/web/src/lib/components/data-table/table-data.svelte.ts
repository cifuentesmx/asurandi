import { getContext, setContext, tick } from "svelte";

const SESSION_KEY = Symbol('DATA_SESSION')

class TableData<T> {
    private originalData = $state<T[]>([])
    data = $state<T[]>([])
    key = $state<number>(0)
    filterStr = $state('')
    constructor() {
        $effect(() => {
            if (!this.filterStr) this.data = this.originalData;
            else this.data = this.originalData.filter((item: T) => {
                return Object.values(item as Record<string, unknown>).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(
                            this.filterStr.toLowerCase()
                        )
                );
            });
        })
    }
    async removeElement(element: T, accessorKey: string = 'id'): Promise<boolean> {
        try {
            const idx = this.originalData.findIndex(
                (t) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    return t[`${accessorKey}`] === element[`${accessorKey}`]
                }
            );
            if (idx !== -1) {
                this.originalData.splice(idx, 1);
            }
            return true
        } catch {
            return false
        } finally {
            await this.reset()
        }
    }
    async updateElement(element: T, accessorKey: string = 'id'): Promise<boolean> {
        try {
            const idx = this.originalData.findIndex(
                (t) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    return t[`${accessorKey}`] === element[`${accessorKey}`]
                }
            );
            if (idx !== -1) {
                this.originalData[idx] = element;
            }
            return true
        } catch {
            return false
        } finally {
            await this.reset()
        }
    }
    async setTableData(data: T[]) {
        this.originalData = data
        this.filterStr = ' \u2008'
        await tick()
        this.filterStr = ''
        await tick()
    }
    async reset() {
        this.setTableData(this.originalData)
        await tick()
        this.filterStr = ' \u2008'
        await tick()
        this.filterStr = ''
        await tick()
    }
}


export function setTableData() {
    return setContext(SESSION_KEY, new TableData())
}

export function getTableDataObject() {
    return getContext<ReturnType<typeof setTableData>>(SESSION_KEY)
}

