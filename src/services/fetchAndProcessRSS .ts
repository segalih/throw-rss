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

      for (const item of feed.rss.channel.item) {
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

        const saved = await saveNews({ ...newsItem, pubDate: item.pubDate });

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
            logger.info(
              `✅ Berita berhasil dikirim ke Telegram: ${saved.title}`
            );
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
