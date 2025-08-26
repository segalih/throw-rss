import cron from "node-cron";
import { connectDB } from "./config/db";
import { logger } from "./utils/logger";
import { fetchAndProcessRSS } from "./services/fetchAndProcessRSS ";
import { News } from "./models/News";

// Koneksi ke MongoDB
connectDB().then(() => {
  logger.info("MongoDB connected. Starting cronjob...");

  // async function test() {
  //   const news = await News.create({
  //     title: "Test",
  //     link: "https://example.com",
  //     description: "Test description",
  //     source: "Test source",
  //     sent: false,
  //   });
  //   await news.save();
  // }

  // // Jalankan test
  // test();

  // Jalankan setiap 30 menit (sesuaikan dengan kebutuhan)
  cron.schedule("* * * * *", async () => {
    logger.info("Running RSS fetch cronjob...");
    await fetchAndProcessRSS();
  });
});
