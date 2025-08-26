import { News } from "../models/News";
import { logger } from "../utils/logger";

export const saveNews = async (newsItem: any) => {
  try {
    const existing = await News.findOne({ link: newsItem.link });
    if (existing) {
      return existing;
    }

    const news = new News(newsItem);
    await news.save();

    return news;
  } catch (err) {
    logger.error(`Failed to save news (${newsItem.link}):`, err); // Log 5: Jika error
    return null;
  }
};

export const updateSentStatus = async (link: string) => {
  await News.updateOne({ link }, { sent: true });
};
