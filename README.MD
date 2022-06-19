# 🤖 nodejs-tg-bot-api

### ⚠️ Not all api methods are implemented now, I am adding them as they are applied on my project
### Features
 - One dependency (axios)
 - Some handy services for formatting text and send buttons

## Installation

`npm i nodejs-tg-bot-api`

## Usage

```typescript
import { TelegramApi, Button, Md } from "nodejs-tg-bot-api";

const api = new TelegramApi('YOUR_TELEGRAM_BOT_TOKEN');

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
            chat_id: TelegramApi.getSenderChatId(lastUpdate),
            text: Md.lines(
                Md.bold('Bold text'),
                Md.url('https://ya.ru', 'Some text link'),
                Md.url('https://google.com'), // link without text
                Md.spacer(3), // just empty lines
                Md.spoiler('Danger spoiler'), // hidden message
            ),
        });

        await api.sendMessage({
            chat_id: TelegramApi.getSenderChatId(lastUpdate),
            text: 'Some text with buttons',
            reply_markup: {
                inline_keyboard: [
                    [ Button.withCallback('Some button with callback data', { test: 123 }) ], // Buttons row
                  ],
                keyboard: [
                    [ Button.contact('🤙🏻 Send Contact'), Button.justText('Text button'), Button.justText('2')  ], // Buttons row
                    [ Button.location('Location button') ], // Buttons row
                ]
            }
        });
        
    } catch (error) {
        console.error('Some error', error);
    }
})();

```