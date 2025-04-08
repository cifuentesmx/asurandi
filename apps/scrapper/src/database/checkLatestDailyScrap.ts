import { SaasAccount } from '@asurandi/types';
import { admFirestoreService } from "../firebase/admFirestoreService.js"
import { UpdateRequestPolizasInRange } from '@asurandi/types';
import { MessageBusMessage } from '@asurandi/types';
import { sendToMessageBus } from '../sendMessage.js';

export const checkLastDailyScrap = async () => {

    console.info('Runing scheduler...')
    const accounts = await admFirestoreService.getCollection('/accounts') as Partial<SaasAccount>[]

    await admFirestoreService.setDocument(`/accounts/bullbrothers`, {
        lastQualitasDaily: '2024-11-01',
    })

    accounts.forEach(async account => {
        console.log(`account: ${account.id} lastDailyScrap: ${account.lastQualitasDaily}`)
        if (
            account.dailyScrapper
            && typeof account.lastQualitasDaily === 'string'
            && typeof account.id === 'string'
        ) {
            const initial = new Date(account.lastQualitasDaily)
            const now = new Date()
            if (isNaN(initial.getTime())) {
                return
            }
            const diferenciaDias = Math.ceil(Math.abs(now.getTime() - initial.getTime()) / (1000 * 60 * 60 * 24));

            const interval = diferenciaDias > 10 ? 10 : 1

            const end = new Date(initial.getTime() + interval * 1000 * 60 * 60 * 24 + 1).toISOString().substring(0, 10)
            const start = new Date(initial.getTime() + 1000 * 60 * 60 * 24).toISOString().substring(0, 10)

            const updateRequest: UpdateRequestPolizasInRange = {
                intents: 0,
                company: 'qualitas',
                start,
                end,
                saasId: account.id,
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
    });


}