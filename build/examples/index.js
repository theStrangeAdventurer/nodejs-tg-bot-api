"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); // dev dependency
const api_1 = require("../api");
const services_1 = require("../services");
dotenv_1.default.config();
const api = new api_1.TelegramApi(process.env.BOT_TOKEN);
(async function main() {
    var _a, _b;
    try {
        const botInfo = await api.getMe();
        const allUpdates = await api.getUpdates();
        const lastUpdate = await api.getLastUpdate(); // same as getUpdates({ limit: 1, offset: -1 })
        if (!lastUpdate) {
            console.log('Have not updates...');
            return process.exit(1);
        }
        await api.sendMessage({
            chat_id: (_a = lastUpdate.message) === null || _a === void 0 ? void 0 : _a.chat.id,
            text: services_1.Md.lines(services_1.Md.bold('Bold text'), services_1.Md.url('https://ya.ru', 'Some text link'), services_1.Md.url('https://google.com'), // link without text
            services_1.Md.spacer(3), // just empty lines
            services_1.Md.spoiler('Danger spoiler')),
        });
        await api.sendMessage({
            chat_id: (_b = lastUpdate.message) === null || _b === void 0 ? void 0 : _b.chat.id,
            text: 'Some text with buttons',
            reply_markup: {
                inline_keyboard: [
                    [services_1.Button.withCallback('Some button with callback data', { test: 123 })], // Buttons row
                ],
                keyboard: [
                    [services_1.Button.contact('🤙🏻 Send Contact'), services_1.Button.justText('Text button'), services_1.Button.justText('2')],
                    [services_1.Button.location('Location button')], // Buttons row
                ],
            },
        });
    }
    catch (error) {
        console.error('Some error', error);
    }
})();
//# sourceMappingURL=index.js.map