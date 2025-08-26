import { News } from "../models/News";
import { logger } from "../utils/logger";

export const saveNews = async (newsItem: any) => {
  try {
    const existing = await News.findOne({ link: newsItem.link });
    if (existing) return null;
    const news = new News(newsItem);
    await news.save();
    return news;
  } catch (err) {
    logger.error("Failed to save news:", err);
    return null;
  }
};

export const updateSentStatus = async (link: string) => {
  await News.updateOne({ link }, { sent: true });
};
