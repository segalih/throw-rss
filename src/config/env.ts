import dotenv from "dotenv";
dotenv.config();

export const env = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    channelId: process.env.TELEGRAM_CHANNEL_ID!,
    threadId: process.env.TELEGRAM_THREAD_ID,
  },
  db: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
    port: process.env.DB_PORT!,
  },
  rss: {
    urls: process.env.RSS_FEED_URLS!.split(","),
  },
};
