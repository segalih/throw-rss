import { env } from "../config/env";
import { fetchRSS } from "./rss"; // Fungsi fetchRSS yang sudah ada
import { saveNews, updateSentStatus } from "./db";
import { sendToTelegram } from "./telegram";
import { logger } from "../utils/logger";

export const fetchAndProcessRSS = async () => {
  for (const url of env.rss.urls) {
    console.log(`Processing RSS from ${url}`);
    try {
      const feed = await fetchRSS(url);
      const source = feed.link;
      console.log("feed", feed);
      for (const item of feed.rss.channel.item) {
        const newsItem = {
          title: item.title,
          link: item.link,
          pubDate: new Date(item.pubDate),
          description: item.description,
          source,
        };
        const saved = await saveNews(newsItem);
        if (saved && !saved.sent) {
          await sendToTelegram(
            `📰 *${saved.title}*\n${saved.description}\n[Baca selengkapnya](${saved.link})`
          );
          await updateSentStatus(saved.link);
        }
      }
    } catch (err) {
      logger.error(`Failed to process RSS from ${url}:`, err);
    }
  }
};
