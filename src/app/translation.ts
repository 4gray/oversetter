export class Translation {
    code: number;
    lang: string;
    text: string;

    constructor(code: number, lang: string, text: string) {
        this.code = code;
        this.lang = lang;
        this.text = text;
    }
}