import { env } from "../config/env";
import { fetchRSS } from "./rss";
import { saveNews, updateSentStatus } from "./db";
import { sendToTelegram } from "./telegram";
import { logger } from "../utils/logger";
import he from "he";

const decodeText = (text: string): string => he.decode(text || "").trim();

const formatDate = (date: string | Date): string =>
  new Date(date).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

const buildMessage = (news: {
  title: string;
  description: string;
  link: string;
  source: string;
  pubDate: string | Date;
}): string => `
🚨 <b>${decodeText(news.title)}</b>

📝 ${decodeText(news.description)}

🔗 <a href="${news.link}">Baca selengkapnya</a>

📰 ${decodeText(news.source)}  
🗓️ ${formatDate(news.pubDate)}

#Crypto #News #${news.source.replace(/[^a-zA-Z0-9]/g, "")}
`;

const processNewsItem = async (item: any, source: string): Promise<void> => {
  const newsItem = {
    title: decodeText(item.title),
    link: item.link!,
    description: decodeText(
      (item.contentSnippet || item.content || item.description || "").replace(
        /<[^>]*>/g,
        ""
      )
    ),
    source,
    pubDate: item.pubDate,
  };

  const saved = await saveNews(newsItem);
  if (!saved || saved.sent) return;

  try {
    const message = buildMessage(newsItem);
    await sendToTelegram(message);

    logger.info(`✅ Berita berhasil dikirim ke Telegram: ${saved.title}`);
    await updateSentStatus(saved.link);
  } catch (err) {
    logger.error(
      `❌ Gagal kirim Telegram untuk berita: ${saved.title} (${saved.link})`,
      err
    );
  }
};

export const fetchAndProcessRSS = async (): Promise<void> => {
  for (const url of env.rss.urls) {
    logger.info(`🔄 Processing RSS from ${url}`);
    try {
      const feed = await fetchRSS(url);
      if (!feed) continue;

      const source = feed.rss.channel.title;
      for (const item of feed.rss.channel.item) {
        await processNewsItem(item, source);
      }
    } catch (err) {
      logger.error(`❌ Failed to process RSS from ${url}:`, err);
    }
  }
};
