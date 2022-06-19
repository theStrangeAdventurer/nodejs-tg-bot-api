import { ApiPhotoResponse, ApiGetMeResponse, ApiUpdateResponse, ApiUpdateItem, ApiChatResponse } from '../@types/api';
import { Button } from '../services';
declare type AnyObject = Record<string, unknown>;
export declare class TelegramApi {
    private token;
    private timeout;
    private basePrefix;
    private filePrefix;
    constructor(token: string, timeout?: number);
    /**
     * https://core.telegram.org/bots/api#getchat
     * @param {string | number} chatId identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @method {getChat}
     */
    getChat(chatId: string | number): Promise<ApiChatResponse>;
    getChatMemberCount(chatId: string | number): Promise<AnyObject>;
    /**
     * https://core.telegram.org/bots/api/#sendmessage
     * @method {sendMessage}
     */
    sendMessage(data: {
        chat_id: number;
        text: string;
        /**
         * If the message is a reply, ID of the original message
         * @param {reply_to_message_id}
         */
        reply_to_message_id?: number;
        /**
         * Protects the contents of the sent message from forwarding and saving
         * @param {protect_content}
         */
        protect_content?: boolean;
        /**
         * Sends the message silently. Users will receive a notification with no sound.
         * @param {disable_notification}
         */
        disable_notification?: boolean;
        /**
         * https://core.telegram.org/bots/api#formatting-options
         * @param {parse_mode}
         */
        parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
        reply_markup?: Partial<{
            /**
             * https://core.telegram.org/bots/api#inlinekeyboardmarkup
             * @param {inline_keyboard}
             */
            inline_keyboard: Button[][];
            /**
             * https://core.telegram.org/bots/api/#replykeyboardmarkup
             * @param {keyboard}
             */
            keyboard: Button[][];
            /**
             * Optional. Requests clients to resize the keyboard vertically for optimal fit
             * (e.g., make the keyboard smaller if there are just two rows of buttons).
             * Defaults to false, in which case the custom keyboard
             * is always of the same height as the app's standard keyboard.
             * @param {resize_keyboard}
             */
            resize_keyboard: boolean;
            /**
             * Optional. Requests clients to hide the keyboard as soon as it's been used.
             * The keyboard will still be available,
             * but clients will automatically display the usual letter-keyboard in the chat
             * - the user can press a special button in the input field to see the custom keyboard again.
             * Defaults to false.
             * @param {one_time_keyboard}
             */
            one_time_keyboard: boolean;
            /**
             * Optional. The placeholder to be shown in the input field
             * when the reply is active; 1-64 characters
             * @param {input_field_placeholder}
             */
            input_field_placeholder: string;
            /**
             * Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply'
             * @param {force_reply}
             */
            force_reply: boolean;
            /**
             * Requests clients to remove the custom keyboard
             * user will not be able to summon this keyboard,
             * if you want to hide the keyboard from sight but keep it accessible,
             * use one_time_keyboard in ReplyKeyboardMarkup
             *
             * @param {remove_keyboard}
             */
            remove_keyboard: boolean;
        }>;
    }): Promise<AnyObject>;
    getFile(fileId: string): Promise<ApiPhotoResponse>;
    getFileSource(filePath: string): string;
    static getSenderChatId(message: ApiUpdateItem): number;
    getMe(): Promise<ApiGetMeResponse>;
    getUpdates(data?: Partial<{
        limit: number;
        offset: number;
        timeout: number;
        allowed_updates: string[];
    }>): Promise<ApiUpdateResponse>;
    getLastUpdate(): Promise<ApiUpdateItem | null>;
    answerCallbackQuery(data: {
        callback_query_id: string;
        text?: string;
        show_alert?: boolean;
        url?: string;
        cache_time?: number;
    }): Promise<AnyObject>;
    private request;
}
export {};
