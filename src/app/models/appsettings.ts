/**
 * Settings class contains getters and setters for all application options
 * It uses local storage as store for api key and last used translation directions
 */
export class AppSettings {

    /**
     * API key for yandex translate service
     *
     * @private
     * @static
     * @memberof AppSettings
     */
    private static apiKey = localStorage.getItem('apiKey');

    /**
     * Language list
     *
     * @private
     * @static
     * @memberof AppSettings
     */
    private static langsList = [];

    /**
     * Tatget language
     *
     * @private
     * @static
     * @type {string}
     * @memberof AppSettings
     */
    private static toLang: string;

    /**
     * Origin language
     *
     * @private
     * @static
     * @type {string}
     * @memberof AppSettings
     */
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

    public static get $API_KEY(): string {
        return this.apiKey;
    }

    public static set $API_KEY(key: string) {
        this.apiKey = key;
    }

    public static get $LANGS() {
        return this.langsList;
    }

    public static set $LANGS(list) {
        this.langsList = list;
    }

}
