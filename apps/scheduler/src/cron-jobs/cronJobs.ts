// import { admFirestoreService } from "../firebase/admFirestoreService"
// import { SaasAccount } from "../types/saas-account"
import { checkLastDailyScrap } from "./checkLatestDailyScrap.js"

export const cronJobs = async () => {
    // await admFirestoreService.setDocument('/accounts/bullbrothers', { lastQualitasDaily: '2024-01-10' } as Partial<SaasAccount>)
    await checkLastDailyScrap()
}