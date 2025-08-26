import TelegramBot from "node-telegram-bot-api";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const bot = new TelegramBot(env.telegram.botToken);

export const sendToTelegram = async (message: string) => {
  try {
    if (env.telegram.threadId) {
      await bot.sendMessage(env.telegram.channelId, message, {
        message_thread_id: parseInt(env.telegram.threadId),
      });
    } else {
      await bot.sendMessage(env.telegram.channelId, message);
    }
    logger.info("Message sent to Telegram");
  } catch (err) {
    logger.error("Failed to send to Telegram:", err);
  }
};
