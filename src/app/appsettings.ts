/**
 * Settings class contains getters and setters for all application options
 * Uses localstorage as store for api key and last used translation directions
 */
export class AppSettings {
    private static apiKey = localStorage.getItem('apiKey');
    private static langsList: object;

    public static get API_KEY(): string {
        return this.apiKey;
    }

    public static set API_KEY(key: string) {
        this.apiKey = key;
    }

    public static get LANGS(): object {
        return this.langsList;
    }

    public static set LANGS(list: object) {
        this.langsList = list;
    }

}
