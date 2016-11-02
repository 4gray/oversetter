export class Translation {
    code: number;
    lang: string;
    text: String[];

    constructor(code:number, lang:string, text:String[]) {
    	this.code = code;
    	this.lang = lang;
    	this.text = text;
    }
}