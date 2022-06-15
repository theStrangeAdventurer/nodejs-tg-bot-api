"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramApi = void 0;
const https_1 = __importDefault(require("https"));
const API_HOST = 'https://api.telegram.org';
const TIMEOUT_MS = 2000;
class TelegramApi {
    constructor(token, timeout = TIMEOUT_MS) {
        this.token = token;
        this.timeout = timeout;
        this.basePrefix = `/bot${this.token}`;
        this.filePrefix = `/file/bot${this.token}`;
    }
    sendMessage(data) {
        return this.request('/sendMessage', Object.assign(data, {
            parse_mode: 'MarkdownV2',
        }));
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
    request(path, body = {}, useBasePrefix = true) {
        return new Promise((resolve, reject) => {
            const prefix = useBasePrefix ? this.basePrefix : this.filePrefix;
            const data = [];
            const url = `${API_HOST}${prefix}${path}`;
            const postData = JSON.stringify(body);
            const req = https_1.default.request(url, {
                timeout: this.timeout,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length,
                },
            }, (res) => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`RequestError: ${res.statusMessage}, code: ${res.statusCode}`));
                }
                res
                    .on('data', (chunk) => data.push(chunk))
                    .on('end', () => {
                    resolve(JSON.parse(data.join('').toString()));
                    req.destroy();
                });
            });
            req
                .on('timeout', () => {
                const error = new Error(`The request time has expired, ${TIMEOUT_MS}ms`);
                reject(error);
            })
                .on('error', reject)
                .write(postData);
            req.end();
        });
    }
}
exports.TelegramApi = TelegramApi;
//# sourceMappingURL=index.js.map