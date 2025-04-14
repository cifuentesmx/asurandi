import { checkLastDailyScrap } from "./cron-jobs/checkLatestDailyScrap.js";
import cron from 'node-cron'
import { startConsumer } from "./messageProcessor.js";
import { sendTodos } from "./cron-jobs/sendTodos.js";
import { env } from './env.js';
import { cleanupFiles } from "./cron-jobs/cleanupFiles.js";
(async () => {
  try {

    // Daily Scrapper
    cron.schedule(env.DAILY_SCRAPPER_CRONTAB_STRING, async () => {
      await checkLastDailyScrap()
    })
    console.info(`${new Date()} - Daily Scrapper Scheduler started: ${env.DAILY_SCRAPPER_CRONTAB_STRING}`)

    // weekly report
    cron.schedule(env.WEEKLY_REPORT_CRONTAB_STRING, async () => {
      await sendTodos('weekly')
    })
    console.info(`${new Date()} - Weekly Report Scheduler started: ${env.WEEKLY_REPORT_CRONTAB_STRING}`)

    // Monthly Report
    cron.schedule(env.MONTHLY_REPORT_CRONTAB_STRING, async () => {
      await sendTodos('monthly')
    })
    console.info(`${new Date()} - Monthly Report Scheduler started: ${env.MONTHLY_REPORT_CRONTAB_STRING}`)

    // Cleanup Files
    cron.schedule(env.CLEANUP_FILES_CRONTAB_STRING, async () => {
      await cleanupFiles(`${process.cwd()}/storage`)
    })
    console.info(`${new Date()} - Cleanup Files Scheduler started: ${env.CLEANUP_FILES_CRONTAB_STRING}`)

    // Start jobs consumer
    await startConsumer()

  } catch (err) {
    console.error(`${new Date()} - Error starting server...`);
    console.error(err);
  }
})()


