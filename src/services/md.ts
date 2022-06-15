export class Md {
  static prepare(value: string) {
    const escapedSymbols = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];

    return value.split('').reduce((acc, curr) => {
      if (escapedSymbols.includes(curr)) {
        curr = `\\${curr}`;
      }
      acc += curr;
      return acc;
    }, '');
  }
  static italic(text: string) {
    return `_${Md.prepare(text)}_`;
  }
  static underline(text: string) {
    return `__${Md.prepare(text)}__`;
  }
  static strike(text: string) {
    return `~${Md.prepare(text)}~`;
  }
  static spoiler(text: string) {
    return `||${Md.prepare(text)}||`;
  }
  static inlineCode(text: string) {
    return `\`${Md.prepare(text)}\``;
  }
  static blockCode(text: string) {
    return `\`\`\`\n${Md.prepare(text)}\n\`\`\``;
  }
  static bold(text: string) {
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
  static url(url: string, text?: string) {
    if (!text) {
      text = url;
    }
    return `[${Md.prepare(text)}](${Md.prepare(url)})`;
  }
  static lines(...texts: string[]) {
    return texts.join('\n');
  }
}
