type ApiResponse<T> = {
  ok: boolean;
  result: T;
};

type ApiUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
};

type ApiChat = {
  first_name: string;
  id: number;
  last_name: string;
  type: 'private' | 'public';
  username: string;
};

type ApiSticker = {
  width: number;
  height: number;
  emoji: string;
  set_name: string;
  is_animated: string;
  is_video: string;
  thumb: {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    width: number;
    height: number;
  };
  file_id: string;
  file_unique_id: string;
  file_size: number;
};

type ApiMessage = {
  message_id: number;
  date: number;
  chat: ApiChat;
  from?: ApiUser;
  sticker?: ApiSticker;
  contact?: ApiContact;
};

type ApiContact = {
  phone_number: string;
  first_name: string;
  last_name: string;
  user_id: number;
};

type ApiUpdateItem = {
  update_id: number;
  message?: ApiMessage;
};

type ApiUpdateResponse = ApiResponse<ApiUpdateItem[]>;

type ApiGetMeResponse = ApiResponse<{
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}>;
