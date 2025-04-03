import "dotenv/config";
import { cronJobs } from "./cron-jobs/cronJobs.js";
import cron from 'node-cron'

(async () => {
  try {
    const crontab = process.env.DAILY_STATS_CRONTAB_STRING ?? '0 */4 * * *'
    cron.schedule(crontab, async () => {
      await cronJobs()
    })
    console.log('Crontab: ', crontab)
  } catch (err) {
    console.error(`${new Date()} - Error starting server...`);
    console.error(err);
  }
})()