import "dotenv/config";
import { startConsumer } from "./messageProcessor.js";
import { MessageBusMessage, UpdateRequestPoliza } from "@asurandi/types";
// import { dailyScrapper } from "./events/dailyScrapper.js";
import { updatePoliza } from "events/updatePoliza.js";
import { readPDF } from "utils/readPDF.js";
import fs from 'fs-extra';
import path from 'path';
import { extractDataFromPdf, type DataFromPdf } from "anaseguros/processScrapped/extactDataFromPdf.js";
import { uploadFile } from "utils/uploadFile.js";

const start = async () => {
  try {
    // await startConsumer()
    const request: MessageBusMessage<UpdateRequestPoliza> = {
      exchange: 'ex.scrapper',
      routingKey: 'poliza',
      ttl: 14_400_000, // 4 hours
      intents: 0,
      maxIntents: 0,
      payload: {
        saasId: 'bullbrothers',
        company: 'anaseguros',
        intents: 0,
        agent: '09660',
        numeroPoliza: '004944937',
        cuenta: 'AGENTE',
      }
    }
    await updatePoliza(request)

    // const request: MessageBusMessage<UpdateRequestPolizasInRange> = {
    //   exchange: 'ex.scrapper',
    //   routingKey: 'dailyScrapper',
    //   ttl: 14_400_000, // 4 hours
    //   intents: 0,
    //   maxIntents: 0,
    //   payload: {
    //     saasId: 'bullbrothers',
    //     company: 'anaseguros',
    //     intents: 0,
    //     start: '2025-01-01',
    //     end: '2025-01-31',
    //   }
    // }
    // await dailyScrapper(request)

    // const pdf = await readPDF('storage/tmp/004944937_000000.pdf')
    // const outputPath = path.join('storage', 'tmp', '004944937_000000.json');
    // await fs.writeJson(outputPath, pdf, { spaces: 2 });
    // console.log(`PDF data saved to ${outputPath}`);
    // const data: DataFromPdf = await extractDataFromPdf(pdf)
    // console.log(data.incisos['0000'])
    // const url = await uploadFile('storage/tmp/004944937_000000.pdf', 'p/test/bullbrothers/polizas/004944937')
    // console.log(url)

  } catch (err) {
    console.error(`${new Date()} - Error starting server...`);
    console.error(err);
  }
};

start()
