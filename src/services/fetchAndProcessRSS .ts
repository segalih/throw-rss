import { env } from "../config/env";
import { fetchRSS } from "./rss"; // Fungsi fetchRSS yang sudah ada
import { saveNews, updateSentStatus } from "./db";
import { sendToTelegram } from "./telegram";
import { logger } from "../utils/logger";

export const fetchAndProcessRSS = async () => {
  for (const url of env.rss.urls) {
    try {
      const feed = await fetchRSS(url);
      const source = feed.rss.channel.title;
      console.log(source);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 jam lalu

      for (const item of feed.rss.channel.item) {
        console.log(JSON.stringify(item));
        const itemPubDate = new Date(item.isoDate || item.pubDate!);
        if (itemPubDate < oneDayAgo) {
          logger.info(`Skipping old news: ${item.title} (${item.link})`);
          continue; // Lewati berita lama
        }

        const newsItem = {
          title: item.title!,
          link: item.link!,
          // pubDate: itemPubDate,
          description: item.contentSnippet || item.content || item.description!,
          source: source,
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
