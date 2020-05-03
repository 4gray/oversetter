/**
 * Settings class contains getters and setters for all application options
 * It uses local storage as store for api key and last used translation directions
 */
export class AppSettings {
    /** API key for yandex translate service */
    private static apiKey = localStorage.getItem('apiKey');

    /** Selected UI theme */
    private static theme = localStorage.getItem('theme') || 'light';

    /** Language list */
    private static languageList = [];

    /** Target language */
    private static toLang: string;

    /** Origin language */
    private static fromLang: string;

    public static get $toLang(): string {
        return this.toLang;
    }

    public static set $toLang(value: string) {
        this.toLang = value;
    }

    public static get $fromLang(): string {
        return this.fromLang;
    }

    public static set $fromLang(value: string) {
        this.fromLang = value;
    }

    public static get $apiKey(): string {
        return this.apiKey;
    }

    public static set $apiKey(key: string) {
        this.apiKey = key;
    }

    public static get $languageList(): any[] {
        return this.languageList;
    }

    public static set $languageList(list) {
        this.languageList = list;
    }

    public static get $theme(): string {
        return this.theme;
    }
}
