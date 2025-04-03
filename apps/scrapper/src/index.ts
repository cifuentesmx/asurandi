import "dotenv/config";
import { startConsumer } from "./messageProcessor.js";

const start = async () => {
  try {
    await startConsumer()
  } catch (err) {
    console.error(`${new Date()} - Error starting server...`);
    console.error(err);
  }
};

start()
