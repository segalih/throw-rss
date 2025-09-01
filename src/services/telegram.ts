import TelegramBot from "node-telegram-bot-api";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const bot = new TelegramBot(env.telegram.botToken);

// Default options untuk semua pesan
const baseOptions: TelegramBot.SendMessageOptions = {
  parse_mode: "HTML",
  disable_web_page_preview: true,
};

export const sendToTelegram = async (message: string): Promise<void> => {
  try {
    await bot.sendMessage(env.telegram.mainChannelId, message, baseOptions);

    const options: TelegramBot.SendMessageOptions = {
      ...baseOptions,
      ...(env.telegram.threadId
        ? { message_thread_id: Number(env.telegram.threadId) }
        : {}),
    };

    await bot.sendMessage(env.telegram.channelId, message, options);
  } catch (err) {
    logger.error("❌ Failed to send to Telegram:", err);
    throw err;
  }
};
