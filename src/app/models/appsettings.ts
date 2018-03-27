/**
 * Settings class contains getters and setters for all application options
 * Uses localstorage as store for api key and last used translation directions
 */
export class AppSettings {
    private static apiKey = localStorage.getItem('apiKey');
    private static langsList: object;
    private static toLang: string;
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

    public static get $LANGS(): object {
        return this.langsList;
    }

    public static set $LANGS(list: object) {
        this.langsList = list;
    }

}
