"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
class Button {
    static withCallback(text, data) {
        return { text, callback_data: JSON.stringify(data) };
    }
    static create(text, data) {
        return { text, ...data };
    }
    static contact(text) {
        return Button.create(text, { request_contact: true });
    }
    static location(text) {
        return Button.create(text, { request_location: true });
    }
    static justText(text) {
        return Button.create(text, {});
    }
}
exports.Button = Button;
//# sourceMappingURL=button.js.map