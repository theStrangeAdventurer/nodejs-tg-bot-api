import dotenv from 'dotenv'; // dev dependency

import { TelegramApi } from '../api';
import { Button, Md } from '../services';

dotenv.config();

const api = new TelegramApi(process.env.BOT_TOKEN);

(async function main() {
  try {
    const botInfo = await api.getMe();
    const allUpdates = await api.getUpdates();
    const lastUpdate = await api.getLastUpdate(); // same as getUpdates({ limit: 1, offset: -1 })

    if (!lastUpdate) {
      console.log('Have not updates...');
      return process.exit(1);
    }

    await api.sendMessage({
      chat_id: lastUpdate.message?.chat.id,
      text: Md.lines(
        Md.bold('Bold text'),
        Md.url('https://ya.ru', 'Some text link'),
        Md.url('https://google.com'), // link without text
        Md.spacer(3), // just empty lines
        Md.spoiler('Danger spoiler'), // hidden message
      ),
    });

    await api.sendMessage({
      chat_id: lastUpdate.message?.chat.id,
      text: 'Some text with buttons',
      reply_markup: {
        inline_keyboard: [
          [Button.withCallback('Some button with callback data', { test: 123 })], // Buttons row
        ],
        keyboard: [
          [Button.contact('🤙🏻 Send Contact'), Button.justText('Text button'), Button.justText('2')], // Buttons row
          [Button.location('Location button')], // Buttons row
        ],
      },
    });
  } catch (error) {
    console.error('Some error', error);
  }
})();
