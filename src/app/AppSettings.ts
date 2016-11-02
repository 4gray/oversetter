export class AppSettings {
	private static apiKey = localStorage.getItem('apiKey');
	public static get API_KEY(): string { return this.apiKey; }
	public static set API_KEY(key:string) { this.apiKey = key; }
}