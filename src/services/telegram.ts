import TelegramBot from "node-telegram-bot-api";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const bot = new TelegramBot(env.telegram.botToken);

export const sendToTelegram = async (message: string) => {
  try {

    await bot.sendMessage(env.telegram.mainChannelId, message, {
      parse_mode: "Markdown",
    });
    if (env.telegram.threadId) {
      await bot.sendMessage(env.telegram.channelId, message, {
        message_thread_id: parseInt(env.telegram.threadId),
        parse_mode: "Markdown",
      });
    } else {
      await bot.sendMessage(env.telegram.channelId, message, {
        parse_mode: "Markdown",
      });
    }
  } catch (err) {
    logger.error("Failed to send to Telegram:", err);
    throw err;
  }
};
