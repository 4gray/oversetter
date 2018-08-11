import { Language } from '@app/models/language';

export class DictionaryItem {
    /**
     * Text to translate
     *
     * @private
     * @type {string}
     * @memberof DictionaryItem
     */
    private text: string;

    /**
     * Transalted text
     *
     * @private
     * @type {string}
     * @memberof DictionaryItem
     */
    private translation: string;

    /**
     * Origin text
     *
     * @private
     * @type {Language}
     * @memberof DictionaryItem
     */
    private fromLang: Language;

    /**
     * Target language
     *
     * @private
     * @type {Language}
     * @memberof DictionaryItem
     */
    private toLang: Language;

    /**
     *Creates an instance of DictionaryItem.
     * @param {string} text text to translate
     * @param {string} translation translated text
     * @param {Language} fromLang origin language
     * @param {Language} toLang target language
     * @memberof DictionaryItem
     */
    constructor(text: string, translation: string, fromLang: Language, toLang: Language) {
        this.text = text;
        this.translation = translation;
        this.fromLang = fromLang;
        this.toLang = toLang;
    }

    /**
     * Getter $text
     * @return {string}
     */
    public get $text(): string {
        return this.text;
    }

    /**
     * Getter $translation
     * @return {string}
     */
    public get $translation(): string {
        return this.translation;
    }

    /**
     * Getter $fromLang
     * @return {Language}
     */
    public get $fromLang(): Language {
        return this.fromLang;
    }

    /**
     * Getter $toLang
     * @return {Language}
     */
    public get $toLang(): Language {
        return this.toLang;
    }

    /**
     * Setter $text
     * @param {string} value
     */
    public set $text(value: string) {
        this.text = value;
    }

    /**
     * Setter $translation
     * @param {string} value
     */
    public set $translation(value: string) {
        this.translation = value;
    }

    /**
     * Setter $fromLang
     * @param {Language} value
     */
    public set $fromLang(value: Language) {
        this.fromLang = value;
    }

    /**
     * Setter $toLang
     * @param {Language} value
     */
    public set $toLang(value: Language) {
        this.toLang = value;
    }

}
