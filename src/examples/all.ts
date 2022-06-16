import dotenv from 'dotenv'; // dev dependency

import { TelegramApi } from '../api';
import { Button, Md } from '../services';

dotenv.config();

const api = new TelegramApi(process.env.BOT_TOKEN);

const handleUpdates = async () => {
  try {

    // Send message with markdown
    await api.sendMessage({
      chat_id: Number(process.env.TEST_CHAT_ID),
      text: Md.lines(
        Md.bold('Bold text'),
        Md.url('https://ya.ru', 'Some text link'),
        Md.url('https://google.com'), // link without text
        Md.spacer(3), // just empty lines
        Md.spoiler('Danger spoiler'), // hidden message
      ),
    });
    // Some bot information
    const botInfo = await api.getMe();

    // Any Updates https://core.telegram.org/bots/api#getupdates
    const allUpdates = await api.getUpdates();

    await api.sendMessage({
      chat_id: Number(process.env.TEST_CHAT_ID),
      text: Md.blockCode('const a = 2 + 2;'),
      reply_markup: {
        inline_keyboard: [[Button.withCallback('test text!', { test: 'woof' })]],
      },
    });

    // Get only last available update
    const lastUpdate = await api.getLastUpdate(); // same as getUpdates({ limit: 1, offset: -1 })

    // get file by file_id (you can receive photo from api.getUpdates())
    const fileExample = await api.getFile(process.env.TEST_FILE_ID);
    const fileSrc = api.getFileSource(fileExample.result.file_path);

    // Use updates to receive chat and file ids for reply to bot
    if (!lastUpdate) {
      console.log('Have not updates...');
      return process.exit(1);
    }

    const replyChatId = TelegramApi.getChatId(lastUpdate);

    // // Send message with Buttons and callback data
    await api.sendMessage({
      chat_id: replyChatId,
      text: 'Some text with buttons',
      reply_markup: {
        inline_keyboard: [
          [Button.withCallback('Some button with callback data', { test: 123 })], // Buttons row
        ],
      },
    });

    // Send message with keyboard Buttons
    await api.sendMessage({
      chat_id: replyChatId,
      text: 'Some text with buttons',
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [Button.contact('🤙🏻 Send Contact'), Button.justText('Text button'), Button.justText('2')], // Buttons row
          [Button.location('Location button')], // Buttons row
        ],
      },
    });
  } catch (error) {
    console.error('Some error', error);
  }
};

const UPDATE_TIME_MS = 2000;

(async function main() {
  handleUpdates(); // First update on app start
  // setInterval(handleUpdates, UPDATE_TIME_MS); // Every UPDATE_TIME_MS check updates from our bot
})();
