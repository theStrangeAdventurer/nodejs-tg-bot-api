import axios from 'axios';
import { ApiPhotoResponse, ApiGetMeResponse, ApiUpdateResponse, ApiUpdateItem, ApiChatResponse, ApiMessage, ApiLabeledPrice } from '../@types/api';
import { Button } from '../services';

const API_HOST = 'https://api.telegram.org';
const DEFAULT_PARSE_MODE = 'MarkdownV2';

type AnyObject = Record<string, unknown>;

export class TelegramApi {
  private basePrefix: string;
  private filePrefix: string;

  constructor(private token: string) {
    this.basePrefix = `/bot${this.token}`;
    this.filePrefix = `/file/bot${this.token}`;
  }

  /**
   * https://core.telegram.org/bots/api#getchat
   * @param {string | number} chatId identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
   * @method {getChat}
   */
  public getChat(chatId: string | number) {
    return this.request<ApiChatResponse>('/getChat', { chat_id: chatId })
  }

  public getChatMemberCount(chatId: string | number) {
    return this.request('/getChatMemberCount', { chat_id: chatId })
  }

  /**
   * https://core.telegram.org/bots/api/#sendmessage
   * @method {sendMessage}
   */
  public sendMessage(data: {
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
  }) {
    const body = {
      parse_mode: DEFAULT_PARSE_MODE,
      ...data,
    };
    return this.request('/sendMessage', body);
  }

  public getFile(fileId: string) {
    return this.request<ApiPhotoResponse>('/getFile', { file_id: fileId });
  }

  public getFileSource(filePath: string) {
    return `${API_HOST}${this.filePrefix}/${filePath}`;
  }

  public static getSenderChatId(message: ApiUpdateItem) {
    if (message?.message) {
      return message.message.chat.id;
    }
    if (message?.callback_query) {
      return message.callback_query?.message?.chat?.id;
    }
  }

  public getMe() {
    return this.request<ApiGetMeResponse>('/getMe');
  }

  /**
   * Use this method to send invoices. On success, the sent Message is returned.
   * https://core.telegram.org/bots/api#sendinvoice
   */
  public sendInvoice(data: {
    /**
     * Payment provider token, obtained via @BotFather
     * @param {provider_token}
     */
    provider_token: string;

    /**
     * Unique identifier for the target chat 
     * or username of the target channel
     * (in the format @channelusername)
     * @param {number | string} chat_id
     */
    chat_id: number | string;

    /**
     * Bot-defined invoice payload,
     * 1-128 bytes. This will not be displayed to the user,
     * use for your internal processes.
     * @param {string} payload
     */
    payload: string;

    /**
     * Product name, 1-32 characters
     * @param {string} title
     */
    title: string;

    /**
     * Product description, 1-255 characters
     * @param {string} description
     */
    description: string;

    /**
     * Price breakdown, a JSON-serialized list of components
     * (
     *   e.g. product price, tax, discount,
     *   delivery cost, delivery tax, bonus, etc.
     * )
     * @param {ApiLabeledPrice[]} prices
     */
    prices: ApiLabeledPrice[];

    /**
     * Three-letter ISO 4217 currency code
     * https://core.telegram.org/bots/payments#supported-currencies
     * @param {string} currency
     */
    currency: 'RUB' | 'USD' | string;

    /**
     * The maximum accepted amount for tips in the smallest units
     *  of the currency (integer, not float/double). 
     * For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145.
     * See the exp parameter in currencies.json,
     * it shows the number of digits past the decimal point for each currency
     * (2 for the majority of currencies). Defaults to 0
     * @param {number} max_tip_amount
     */
    max_tip_amount?: number;
    
    /**
     * A JSON-serialized array of suggested amounts of tips in the smallest units
     * of the currency (integer, not float/double).
     * At most 4 suggested tip amounts can be specified.
     * The suggested tip amounts must be positive,
     * passed in a strictly increased order
     * and must not exceed max_tip_amount.
     * @param {number[]} suggested_tip_amounts
     */
    suggested_tip_amounts?: number[];

    /**
     * JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     * @param {string} provider_data
     */
    provider_data?: string;

    /**
     * URL of the product photo for the invoice.
     * Can be a photo of the goods or a marketing image for a service.
     * People like it better when they see what they are paying for.
     * @param {string} photo_url
     */
    photo_url?: string;

    /**
     * Additional optional data
     * @param {any} optional
     */
    [optional: string]: any;
  }) {
    return this.request<ApiMessage>('/sendInvoice', data);
  }

  /**
   * Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.
   * https://core.telegram.org/bots/api#answerprecheckoutquery
   */
  public answerPreCheckoutQuery(data: {
    pre_checkout_query_id: string;
    /**
     * Specify True if everything is alright (goods are available, etc.)
     * and the bot is ready to proceed with the order.
     * Use False if there are any problems.
     * @param {boolean} ok
     */
    ok: boolean;

    /**
     * Required if ok is False.
     * Error message in human readable form that explains the reason 
     * for failure to proceed with the checkout
     * (e.g. "Sorry, somebody just bought the last of our amazing black
     * T-shirts while you were busy filling out your payment details.
     * Please choose a different color or garment!").
     * Telegram will display this message to the user.
     * @param {string} error_message
     */
    error_message?: string;
  }) {
    return this.request<boolean>('/answerPreCheckoutQuery', data);
  }

  // https://core.telegram.org/bots/api#getupdates
  public getUpdates(data?: Partial<{ limit: number; offset: number; timeout: number; allowed_updates: string[] }>) {
    return this.request<ApiUpdateResponse>('/getUpdates', data);
  }

  public async getLastUpdate(): Promise<ApiUpdateItem | null> {
    const response = await this.getUpdates({ limit: 1, offset: -1 });
    return !response?.result?.length ? null : response.result[0];
  }

  // https://core.telegram.org/bots/api#answercallbackquery
  public async answerCallbackQuery(data: {
    callback_query_id: string;
    text?: string;
    show_alert?: boolean;
    url?: string;
    cache_time?: number;
  }) {
    return this.request('/answerCallbackQuery', data)
  }

  private async request<T = AnyObject>(path: string, body = {} as AnyObject, useBasePrefix = true): Promise<T> {
    const prefix = useBasePrefix ? this.basePrefix : this.filePrefix;
      const url = `${API_HOST}${prefix}${path}`;
      const response = await axios.post(url, body);
      return response.data;
  }
}
