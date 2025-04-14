import { checkLastDailyScrap } from "./cron-jobs/checkLatestDailyScrap.js";
import cron from 'node-cron'
import { startConsumer } from "./messageProcessor.js";
import { sendTodos } from "./cron-jobs/sendTodos.js";
(async () => {
  try {
    const crontab = process.env.DAILY_STATS_CRONTAB_STRING ?? '0 */4 * * *'
    cron.schedule(crontab, async () => {
      await checkLastDailyScrap()
    })
    await startConsumer()
    await sendTodos('weekly')
    console.log('Crontab: ', crontab)
  } catch (err) {
    console.error(`${new Date()} - Error starting server...`);
    console.error(err);
  }
})()


