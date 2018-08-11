/**
 * Model class of translation object
 *
 * @export
 * @class Translation
 */
export class Translation {

    /**
     * Language code/abbreviation
     *
     * @private
     * @type {number}
     * @memberof Translation
     */
    private code: number;

    /**
     * Language as label
     *
     * @private
     * @type {string}
     * @memberof Translation
     */
    private lang: string;

    /**
     * Text to translate
     *
     * @private
     * @type {string}
     * @memberof Translation
     */
    private text: string;

    constructor(code: number, lang: string, text: string) {
        this.code = code;
        this.lang = lang;
        this.text = text;
    }

    public get $code(): number {
        return this.code;
    }

    public set $code(value: number) {
        this.code = value;
    }

    public get $lang(): string {
        return this.lang;
    }

    public set $lang(value: string) {
        this.lang = value;
    }

    public get $text(): string {
        return this.text;
    }

    public set $text(value: string) {
        this.text = value;
    }

}
