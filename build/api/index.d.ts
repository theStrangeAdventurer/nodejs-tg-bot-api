import { Button } from '../services';
declare type AnyObject = Record<string, unknown>;
export declare class TelegramApi {
    private token;
    private timeout;
    private basePrefix;
    private filePrefix;
    constructor(token: string, timeout?: number);
    sendMessage(data: {
        chat_id: number;
        text: string;
        reply_markup?: Partial<{
            inline_keyboard: Button[][];
            keyboard: Button[][];
        }>;
    }): Promise<AnyObject>;
    getMe(): Promise<ApiGetMeResponse>;
    getUpdates(data?: Partial<{
        limit: number;
        offset: number;
        timeout: number;
        allowed_updates: string[];
    }>): Promise<ApiUpdateResponse>;
    getLastUpdate(): Promise<ApiUpdateItem | null>;
    private request;
}
export {};
