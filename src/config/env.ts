import dotenv from "dotenv";
dotenv.config();

export const env = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    channelId: process.env.TELEGRAM_CHANNEL_ID!,
    threadId: process.env.TELEGRAM_THREAD_ID,
  },
  db: {
    uri: process.env.MONGO_URI!,
  },
  rss: {
    urls: process.env.RSS_FEED_URLS!.split(","),
  },
};
