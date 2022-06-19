"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramApi = void 0;
const axios_1 = __importDefault(require("axios"));
const API_HOST = 'https://api.telegram.org';
const TIMEOUT_MS = 30;
const DEFAULT_PARSE_MODE = 'MarkdownV2';
class TelegramApi {
    constructor(token, timeout = TIMEOUT_MS) {
        this.token = token;
        this.timeout = timeout;
        this.basePrefix = `/bot${this.token}`;
        this.filePrefix = `/file/bot${this.token}`;
    }
    /**
     * https://core.telegram.org/bots/api#getchat
     * @param {string | number} chatId identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @method {getChat}
     */
    getChat(chatId) {
        return this.request('/getChat', { chat_id: chatId });
    }
    getChatMemberCount(chatId) {
        return this.request('/getChatMemberCount', { chat_id: chatId });
    }
    /**
     * https://core.telegram.org/bots/api/#sendmessage
     * @method {sendMessage}
     */
    sendMessage(data) {
        const body = {
            parse_mode: DEFAULT_PARSE_MODE,
            ...data,
        };
        return this.request('/sendMessage', body);
    }
    getFile(fileId) {
        return this.request('/getFile', { file_id: fileId });
    }
    getFileSource(filePath) {
        return `${API_HOST}${this.filePrefix}/${filePath}`;
    }
    static getSenderChatId(message) {
        var _a, _b, _c;
        if (message === null || message === void 0 ? void 0 : message.message) {
            return message.message.chat.id;
        }
        if (message === null || message === void 0 ? void 0 : message.callback_query) {
            return (_c = (_b = (_a = message.callback_query) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.chat) === null || _c === void 0 ? void 0 : _c.id;
        }
    }
    getMe() {
        return this.request('/getMe');
    }
    // https://core.telegram.org/bots/api#getupdates
    getUpdates(data) {
        return this.request('/getUpdates', data);
    }
    async getLastUpdate() {
        var _a;
        const response = await this.getUpdates({ limit: 1, offset: -1 });
        return !((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.length) ? null : response.result[0];
    }
    // https://core.telegram.org/bots/api#answercallbackquery
    async answerCallbackQuery(data) {
        return this.request('/answerCallbackQuery', data);
    }
    async request(path, body = {}, useBasePrefix = true) {
        const prefix = useBasePrefix ? this.basePrefix : this.filePrefix;
        const url = `${API_HOST}${prefix}${path}`;
        const response = await axios_1.default.post(url, body);
        return response.data;
    }
}
exports.TelegramApi = TelegramApi;
