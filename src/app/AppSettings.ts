/**
 * Settings class contains getters and setters for all application options
 * Uses localstorage as store for api key and last used translation directions
 */
export class AppSettings {
	private static apiKey = localStorage.getItem('apiKey');
	private static langsList: Object;

	public static get API_KEY(): string {
		return this.apiKey;
	}

	public static set API_KEY(key: string) {
		this.apiKey = key;
	}

	public static get LANGS(): Object {
		return this.langsList;
	}

	public static set LANGS(list: Object) {
		this.langsList = list;
	}

}