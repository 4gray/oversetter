import { Language } from '@app/models/language';

export class DictionaryItem {
    /** Text to translate */
    private text: string;

    /** Translated text */
    private translation: string;

    /** Origin text */
    private fromLang: Language;

    /** Target language */
    private toLang: Language;

    /**
     *Creates an instance of DictionaryItem.
     * @param text text to translate
     * @param translation translated text
     * @param fromLang origin language
     * @param toLang target language
     */
    constructor(text: string, translation: string, fromLang: Language, toLang: Language) {
        this.text = text;
        this.translation = translation;
        this.fromLang = fromLang;
        this.toLang = toLang;
    }

    /**
     * Getter $text
     */
    public get $text(): string {
        return this.text;
    }

    /**
     * Getter $translation
     */
    public get $translation(): string {
        return this.translation;
    }

    /**
     * Getter $fromLang
     */
    public get $fromLang(): Language {
        return this.fromLang;
    }

    /**
     * Getter $toLang
     */
    public get $toLang(): Language {
        return this.toLang;
    }

    /**
     * Setter $text
     * @param value
     */
    public set $text(value: string) {
        this.text = value;
    }

    /**
     * Setter $translation
     * @param value
     */
    public set $translation(value: string) {
        this.translation = value;
    }

    /**
     * Setter $fromLang
     * @param value
     */
    public set $fromLang(value: Language) {
        this.fromLang = value;
    }

    /**
     * Setter $toLang
     * @param value
     */
    public set $toLang(value: Language) {
        this.toLang = value;
    }
}
