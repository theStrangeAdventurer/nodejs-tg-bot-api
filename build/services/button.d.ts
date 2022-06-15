export declare class Button {
    static withCallback(text: string, data: Record<string, unknown>): {
        text: string;
        callback_data: string;
    };
    private static create;
    static contact(text: string): {
        request_contact?: boolean;
        request_location?: boolean;
        text: string;
    };
    static location(text: string): {
        request_contact?: boolean;
        request_location?: boolean;
        text: string;
    };
    static justText(text: string): {
        request_contact?: boolean;
        request_location?: boolean;
        text: string;
    };
}
