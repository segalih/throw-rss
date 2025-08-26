import { env } from "../config/env";
import { fetchRSS } from "./rss";
import { saveNews, updateSentStatus } from "./db";
import { sendToTelegram } from "./telegram";
import { logger } from "../utils/logger";

export const fetchAndProcessRSS = async () => {
  for (const url of env.rss.urls) {
    console.log(`Processing RSS from ${url}`);
    try {
      const feed = await fetchRSS(url);
      if (!feed) {
        continue; // Lewati jika fetchRSS mengembalikan null
      }

      const source = feed.rss.channel.title;
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 jam lalu

      for (const item of feed.rss.channel.item) {
        const itemPubDate = new Date(item.isoDate || item.pubDate!);
        // if (itemPubDate < oneDayAgo) {
        //   logger.info(`Skipping old news: ${item.title} (${item.link})`);
        //   continue;
        // }

        const newsItem = {
          title: item.title!,
          link: item.link!,
          description: (
            item.contentSnippet ||
            item.content ||
            item.description ||
            ""
          )
            .replace(/<[^>]*>/g, "") // 🔥 hapus semua HTML tags
            .trim(),
          source,
        };

        const saved = await saveNews(newsItem);

        if (saved && !saved.sent) {
          try {
            const message = `
🚨 *${newsItem.title}*

📝 ${newsItem.description}

📰 Sumber: ${source}  
🗓️ ${new Date(item.pubDate).toLocaleString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            })};

#Crypto #News #${source.replace(/[^a-zA-Z0-9]/g, "")}
`;

            await sendToTelegram(message);
            await updateSentStatus(saved.link);
          } catch (err) {
            logger.error(
              `❌ Gagal kirim Telegram untuk berita: ${saved.title} (${saved.link})`,
              err
            );
          }
        }
      }
    } catch (err) {
      logger.error(`Failed to process RSS from ${url}:`, err);
    }
  }
};
