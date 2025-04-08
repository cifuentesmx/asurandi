import "dotenv/config";
import { cronJobs } from "./cron-jobs/cronJobs.js";
import cron from 'node-cron'
import { startConsumer } from "./messageProcessor.js";
import { reporteConductoCobranzaRenovaciones } from "reports/conducto-cobranza-renovaciones.js";
(async () => {
  try {
    const crontab = process.env.DAILY_STATS_CRONTAB_STRING ?? '0 */4 * * *'
    cron.schedule(crontab, async () => {
      await cronJobs()
    })
    await startConsumer()
    await reporteConductoCobranzaRenovaciones(11)
    console.log('Crontab: ', crontab)
  } catch (err) {
    console.error(`${new Date()} - Error starting server...`);
    console.error(err);
  }
})()


