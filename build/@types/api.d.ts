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
export declare type ApiLabeledPrice = {
    label: string;
    amount: number;
};
export declare type ApiPhotoResponse = ApiResponse<ApiFileCommon & {
    file_path: string;
}>;
export declare type ApiJsonData = string;
/**
 * Shipping Address
 * https://core.telegram.org/bots/api#shippingaddress
 * @param {ApiShippingAddress}
 */
export declare type ApiShippingAddress = {
    country_code: string;
    state: string;
    city: string;
    street_line1: string;
    street_line2: string;
    post_code: string;
};
export declare type ApiOrderInfo = Partial<{
    name: string;
    phone_number: string;
    email: string;
    shipping_address: ApiShippingAddress;
}>;
export declare type ApiPreCheckoutQuery = {
    id: string;
    from: ApiUser;
    currency: string;
    total_amount: number;
    invoice_payload: string;
    shipping_option_id: string;
    order_info?: ApiOrderInfo;
};
export declare type ApiCallbackData = {
    id: string;
    from: ApiUser;
    message: ApiMessage;
    pre_checkout_query?: ApiPreCheckoutQuery;
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
/**
 * Successful Payment object
 * https://core.telegram.org/bots/api#successfulpayment
 * @param {ApiSuccessfulPayment}
 */
export declare type ApiSuccessfulPayment = {
    currency: string;
    total_amount: number;
    invoice_payload: string;
    shipping_option_id: string;
    telegram_payment_charge_id: string;
    provider_payment_charge_id: string;
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
    successful_payment?: ApiSuccessfulPayment;
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
export declare type ApiChatResponse = ApiResponse<{
    id: number;
    title: string;
    type: string;
    description: string;
    invite_link: string;
    photo: {
        small_file_id: string;
        small_file_unique_id: string;
        big_file_id: string;
        big_file_unique_id: string;
    };
}>;
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
