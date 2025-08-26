import { News } from "../models/News";
import { logger } from "../utils/logger";

export const saveNews = async (newsItem: any) => {
  try {
    logger.info(`Checking if news exists: ${newsItem.link}`); // Log 1: Cek link
    const existing = await News.findOne({ link: newsItem.link });
    if (existing) {
      logger.info(`News already exists, skipping: ${newsItem.link}`); // Log 2: Jika sudah ada
      return null;
    }

    logger.info(`Saving new news: ${newsItem.link}`); // Log 3: Sebelum simpan
    logger.info(
      `Attempting to save news: ${JSON.stringify(newsItem, null, 2)}`
    );

    const news = new News(newsItem);
    await news.save();
    logger.info(`Result from saveNews: ${news}`);

    logger.info(`News saved successfully: ${newsItem.link}`); // Log 4: Setelah simpan
    return news;
  } catch (err) {
    logger.error(`Failed to save news (${newsItem.link}):`, err); // Log 5: Jika error
    return null;
  }
};

export const updateSentStatus = async (link: string) => {
  await News.updateOne({ link }, { sent: true });
};
