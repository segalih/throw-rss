import cron from "node-cron";
import { connectDB } from "./config/db";
import { fetchAndProcessRSS } from "./services/fetchAndProcessRSS ";
import { logger } from "./utils/logger";

// Koneksi ke MongoDB
connectDB().then(() => {
  logger.info("MongoDB connected. Starting cronjob...");

  async function test() {
    // const news = await News.create({
    //   title: "Test",
    //   link: "https://example.com",
    //   description: "Test description",
    //   source: "Test source",
    //   sent: false,
    // });
    // await news.save();
    await fetchAndProcessRSS();
  }

  test();

  cron.schedule("*/5 * * * *", async () => {
    logger.info("Running RSS fetch cronjob...");
    await fetchAndProcessRSS();
  });
});
