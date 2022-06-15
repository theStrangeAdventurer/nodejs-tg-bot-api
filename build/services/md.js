"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Md = void 0;
class Md {
    static prepare(value) {
        const escapedSymbols = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
        return value.split('').reduce((acc, curr) => {
            if (escapedSymbols.includes(curr)) {
                curr = `\\${curr}`;
            }
            acc += curr;
            return acc;
        }, '');
    }
    static italic(text) {
        return `_${Md.prepare(text)}_`;
    }
    static underline(text) {
        return `__${Md.prepare(text)}__`;
    }
    static strike(text) {
        return `~${Md.prepare(text)}~`;
    }
    static spoiler(text) {
        return `||${Md.prepare(text)}||`;
    }
    static inlineCode(text) {
        return `\`${Md.prepare(text)}\``;
    }
    static blockCode(text) {
        return `\`\`\`\n${Md.prepare(text)}\n\`\`\``;
    }
    static bold(text) {
        return `*${Md.prepare(text)}*`;
    }
    static spacer(n = 1) {
        let result = '';
        while (n > 0) {
            result += '\n';
            n--;
        }
        return result;
    }
    static url(url, text) {
        if (!text) {
            text = url;
        }
        return `[${Md.prepare(text)}](${Md.prepare(url)})`;
    }
    static lines(...texts) {
        return texts.join('\n');
    }
}
exports.Md = Md;
//# sourceMappingURL=md.js.map