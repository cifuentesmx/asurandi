
export const waitUntil = async (cb: () => Promise<boolean>, timeout = 10_000): Promise<void> => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const id = setTimeout(() => {
                throw new Error("");
            }, timeout);
            try {
                if (await cb()) {
                    resolve()
                }
            } catch (error) {
                reject(error)
            } finally {
                if (interval) clearInterval(interval)
                if (id) clearTimeout(id)
            }
        }, 500);
    })
}