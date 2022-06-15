export declare class Md {
    static prepare(value: string): string;
    static italic(text: string): string;
    static underline(text: string): string;
    static strike(text: string): string;
    static spoiler(text: string): string;
    static inlineCode(text: string): string;
    static blockCode(text: string): string;
    static bold(text: string): string;
    static spacer(n?: number): string;
    static url(url: string, text?: string): string;
    static lines(...texts: string[]): string;
}
