import { SaasAccount } from '@asurandi/types';
import { admFirestoreService } from "../firebase/admFirestoreService.js"
import { UpdateRequestPolizasInRange } from '@asurandi/types';
import { MessageBusMessage } from '@asurandi/types';
import { sendToMessageBus } from '../sendMessage.js';

const DAY_IN_MS = 1000 * 60 * 60 * 24

export const checkLastDailyScrap = async () => {

    console.info('Runing daily scrap task...')
    const accounts = await admFirestoreService.getCollection('/accounts') as Partial<SaasAccount>[]
    console.log({ accounts })

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (
            account.dailyScrapper
            && typeof account.lastQualitasDaily === 'string'
            && typeof account.id === 'string'
        ) {



            const maxDateToScrape = new Date((new Date().getTime() - DAY_IN_MS))
            console.log({ maxDateToScrape })
            if (account.lastQualitasDaily >= maxDateToScrape.toISOString().substring(0, 10)) return

            const initial = new Date(account.lastQualitasDaily)
            if (isNaN(initial.getTime())) {
                return
            }

            if (initial > maxDateToScrape) return

            const diferenciaDias = Math.ceil((maxDateToScrape.getTime() - initial.getTime()) / DAY_IN_MS);

            const interval = diferenciaDias > 10 ? 10 : 1

            const end = new Date(initial.getTime() + interval * DAY_IN_MS + 1).toISOString().substring(0, 10)
            const start = new Date(initial.getTime() - 1 * DAY_IN_MS).toISOString().substring(0, 10)

            const updateRequest: UpdateRequestPolizasInRange = {
                intents: 0,
                start,
                end,
                saasId: account.id,
                company: 'qualitas'
            }
            const msg: MessageBusMessage<UpdateRequestPolizasInRange> = {
                exchange: 'ex.scrapper',
                intents: 0,
                maxIntents: 5,
                payload: updateRequest,
                retry_ttl: 10_000,
                routingKey: 'daily',
                ttl: 3_600_000
            }

            await sendToMessageBus(msg)

        }
    }
}