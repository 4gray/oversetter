/**
 * Settings class contains getters and setters for all application options
 * Uses localstorage as storage
 */
export class AppSettings {
	private static apiKey = localStorage.getItem('apiKey');
	private static fromLang = localStorage.getItem('fromLang');
	private static toLang = localStorage.getItem('toLang');

	public static get API_KEY(): string { 
		return this.apiKey; 
	}
	public static set API_KEY(key:string) { 
		this.apiKey = key; 
	}

	/*
	public static get FROM_LANG(): string { 
		return this.fromLang; 
	}
	public static set FROM_LANG(lang:string) { 
		this.fromLang = lang; 
	}

	public static get TO_LANG(): string { 
		return this.fromLang; 
	}
	public static set TO_LANG(lang:string) { 
		this.fromLang = lang; 
	}
	*/
}