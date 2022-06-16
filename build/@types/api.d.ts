export declare type ApiResponse<T> = {
    ok: boolean;
    result: T;
};
export declare type ApiUser = {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
};
export declare type ApiChat = {
    first_name: string;
    id: number;
    last_name: string;
    type: 'private' | 'public';
    username: string;
};
export declare type ApiSticker = ApiFileCommon & {
    width: number;
    height: number;
    emoji: string;
    set_name: string;
    is_animated: string;
    is_video: string;
    thumb: ApiFileCommon & {
        width: number;
        height: number;
    };
};
export declare type ApiFileCommon = {
    file_id: string;
    file_unique_id: string;
    file_size: number;
};
export declare type ApiPhotoItem = ApiFileCommon & {
    width: number;
    height: number;
};
export declare type ApiPhotoResponse = ApiResponse<ApiFileCommon & {
    file_path: string;
}>;
export declare type ApiJsonData = string;
export declare type ApiCallbackData = {
    id: string;
    from: ApiUser;
    message: ApiMessage;
    /**
     * Global identifier, uniquely corresponding to the chat
     * to which the message with the callback button was sent.
     * Useful for high scores in games.
     * @param {chat_instance}
     */
    chat_instance: string;
    /**
     * Data associated with the callback button.
     *
     * It is assumed that in callback_jquery.data,
     * serialized data is passed to the string and
     * they can be parsed using JSON.parse
     * @param {data}
     */
    data: ApiJsonData;
};
export declare type ApiLocationData = {
    latitude: number;
    longitude: number;
};
export declare type ApiMessage = {
    message_id: number;
    date: number;
    chat: ApiChat;
    from?: ApiUser;
    sticker?: ApiSticker;
    contact?: ApiContact;
    photo?: ApiPhotoItem[];
    location?: ApiPhotoItem[];
    reply_to_message?: ApiMessage;
    text: string;
};
export declare type ApiContact = {
    phone_number: string;
    first_name: string;
    last_name: string;
    user_id: number;
};
export declare type ApiUpdateItem = {
    update_id: number;
    message?: ApiMessage;
    callback_query?: ApiCallbackData;
};
export declare type ApiUpdateResponse = ApiResponse<ApiUpdateItem[]>;
export declare type ApiGetMeResponse = ApiResponse<{
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    can_join_groups: boolean;
    can_read_all_group_messages: boolean;
    supports_inline_queries: boolean;
}>;
