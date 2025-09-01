import { env } from "../config/env";
import { fetchRSS } from "./rss";
import { saveNews, updateSentStatus } from "./db";
import { sendToTelegram } from "./telegram";
import { logger } from "../utils/logger";
import he from "he";

// Escape untuk MarkdownV2
function escapeMarkdownV2(text: string): string {
  return text
    .replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1")
    .replace(/-/g, "\\-");
}

export const fetchAndProcessRSS = async () => {
  for (const url of env.rss.urls) {
    console.log(`Processing RSS from ${url}`);
    try {
      const feed = await fetchRSS(url);
      if (!feed) continue;

      const source = feed.rss.channel.title;

      for (const item of feed.rss.channel.item) {
        // Decode & bersihkan HTML entity
        const rawTitle = he.decode(item.title || "").trim();
        const rawDesc = he
          .decode(item.contentSnippet || item.content || item.description || "")
          .replace(/<[^>]*>/g, "")
          .trim();

        const newsItem = {
          title: rawTitle,
          link: item.link!,
          description: rawDesc,
          source,
        };

        const saved = await saveNews({ ...newsItem, pubDate: item.pubDate });

        if (saved && !saved.sent) {
          try {
            const message = `
🚨 <b>${he.decode(newsItem.title)}</b>

📝 ${he.decode(newsItem.description)}

🔗 <a href="${newsItem.link}">Baca selengkapnya</a>

📰 ${he.decode(source)}  
🗓️ ${new Date(item.pubDate).toLocaleString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            })}

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
