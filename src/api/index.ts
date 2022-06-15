import https from 'https';
import { Button } from '../services';

const API_HOST = 'https://api.telegram.org';
const TIMEOUT_MS = 2000;

type AnyObject = Record<string, unknown>;

export class TelegramApi {
  private basePrefix: string;
  private filePrefix: string;

  constructor(private token: string, private timeout = TIMEOUT_MS) {
    this.basePrefix = `/bot${this.token}`;
    this.filePrefix = `/file/bot${this.token}`;
  }

  public sendMessage(data: {
    chat_id: number;
    text: string;
    reply_markup?: Partial<{
      inline_keyboard: Button[][];
      keyboard: Button[][];
    }>;
  }) {
    return this.request(
      '/sendMessage',
      Object.assign(data, {
        parse_mode: 'MarkdownV2',
      }),
    );
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
            'Content-Length': postData.length,
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`RequestError: ${res.statusMessage}, code: ${res.statusCode}`));
          }
          res
            .on('data', (chunk: Buffer) => data.push(chunk))
            .on('end', () => {
              resolve(JSON.parse(data.join('').toString()));
              req.destroy();
            });
        },
      );

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
