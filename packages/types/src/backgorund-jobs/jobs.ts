export type BgJobsStatus = 'success' | 'error' | 'pending'
export type BgJob = {
    id: string
    type: 'poliza' | 'dailyScrap'
    status: BgJobsStatus
    message: string
}

export const bgJobLog = async ({ saasId, bgJob }: { saasId: string, bgJob: BgJob }): Promise<void> => {
    console.log('// TODO procesar esto...', saasId, bgJob)
    return
}