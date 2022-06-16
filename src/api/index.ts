import https from 'https';
import { ApiPhotoResponse, ApiGetMeResponse, ApiUpdateResponse, ApiUpdateItem } from '../@types/api';
import { Button } from '../services';

const API_HOST = 'https://api.telegram.org';
const TIMEOUT_MS = 30;
const DEFAULT_PARSE_MODE = 'MarkdownV2';

type AnyObject = Record<string, unknown>;

export class TelegramApi {
  private basePrefix: string;
  private filePrefix: string;

  constructor(private token: string, private timeout = TIMEOUT_MS) {
    this.basePrefix = `/bot${this.token}`;
    this.filePrefix = `/file/bot${this.token}`;
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
      force_reply: true;
    }>;
  }) {
    const body = {
      parse_mode: DEFAULT_PARSE_MODE,
      ...data,
    };
    console.dir({ where: 'before sendMessage', body });
    return this.request('/sendMessage', body);
  }

  public getFile(fileId: string) {
    return this.request<ApiPhotoResponse>('/getFile', { file_id: fileId });
  }

  public getFileSource(filePath: string) {
    return `${API_HOST}${this.filePrefix}/${filePath}`;
  }

  public static getChatId(message: ApiUpdateItem) {
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

  // https://core.telegram.org/bots/api#getupdates
  public getUpdates(data?: Partial<{ limit: number; offset: number; timeout: number; allowed_updates: string[] }>) {
    return this.request<ApiUpdateResponse>('/getUpdates', data);
  }

  public async getLastUpdate(): Promise<ApiUpdateItem | null> {
    const response = await this.getUpdates({ limit: 1, offset: -1 });
    return !response?.result?.length ? null : response.result[0];
  }

  private request<T = AnyObject>(path: string, body = {} as AnyObject, useBasePrefix = true): Promise<T> {
    return new Promise((resolve, reject) => {
      const prefix = useBasePrefix ? this.basePrefix : this.filePrefix;
      const data = [] as Buffer[];
      const url = `${API_HOST}${prefix}${path}`;
      const postData = JSON.stringify(body);
      
      const req = https.request(
        url,
        {
          timeout: this.timeout,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            console.dir({ error: true, url, postData, rawData: body }, { depth: 10 });
            req.destroy();
            reject(new Error(`Error: ${res.statusMessage}, code: ${res.statusCode}`));
          }
          const handleResolve = () => {
            const stringData = data.join('').toString();
            try {
              const resultData = JSON.parse(stringData);
              resolve(resultData);
            } catch (error) {
              console.dir({ error, stringData });
              reject(error);
            } finally {
              req.destroy();
            }
          };
          res
            .on('data', (chunk: Buffer) => {
              data.push(chunk);
            })
            .on('end', () => {
              handleResolve();
            });
        },
      );

      const handleReject = (error) => {
        req.destroy();
        reject(error);
      };

      req.on('error', (err) => {
        if ((err as unknown as AnyObject)?.code === 'ECONNRESET') {
          return handleReject(new Error(`⏱ Timeout has expired: ${TIMEOUT_MS}ms.`));
        }
        handleReject(err);
      });

      req.write(postData);

      req.end();
    });
  }
}
