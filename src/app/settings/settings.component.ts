import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { TranslateService } from '../translate.service';
import { AppSettings } from '../appsettings';

@Component({
	providers: [TranslateService],
	templateUrl: 'settings.component.html'
})

export class SettingsComponent {
	public apiKey: String;
	public errorMessage: String = '';
	public autolaunch: boolean = false;
	public alwaysOnTop: boolean = false;
	public showDockIcon: boolean = false;
	public langList: Object = {};
	public preferedLangList: Object = {};
	public languages: String = 'all-languages';

	/**
	 * Constructor function - set API key from the localstorage
	 * @param translateService translation service object
	 * @param router router object
	 */
	constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService) {
		this.apiKey = AppSettings.API_KEY;
		if (localStorage.getItem('autolaunch')) { // TODO: refactor
			this.autolaunch = (localStorage.getItem('autolaunch') === 'true');
		}

		if (localStorage.getItem('alwaysOnTop')) {
			this.alwaysOnTop = (localStorage.getItem('alwaysOnTop') === 'true');
		}

		if (localStorage.getItem('showDockIcon')) {
			this.showDockIcon = (localStorage.getItem('showDockIcon') === 'true');
		}

		if (localStorage.getItem('languages')) {
			this.showDockIcon = (localStorage.getItem('languages') === 'true');
		}

		if (localStorage.getItem('languages')) {
			this.languages = localStorage.getItem('languages');
			console.log(JSON.parse(localStorage.getItem('preferedLanguageList')));
			this.preferedLangList = JSON.parse(localStorage.getItem('preferedLanguageList'));
		}
		else {
			// set default
			this.preferedLangList = {'en': 'English'};
		}

		this.langList = AppSettings.LANGS;
	}

	/**
	 * Save auto launch options
	 */
	setAutoLaunch() {
		localStorage.setItem('autolaunch', String(this.autolaunch));
		this.electronService.ipcRenderer.send('autolaunch', this.autolaunch);
	}

	/**
	 * Save always as top option
	 */
	setAlwaysOnTop() {
		localStorage.setItem('alwaysOnTop', String(this.alwaysOnTop));
		this.electronService.ipcRenderer.send('alwaysOnTop', this.alwaysOnTop); // TODO: implement in the main process
	}

	/**
	 * Save show dock icon option
	 */
	setShowDockIcon() {
		localStorage.setItem('showDockIcon', String(this.showDockIcon));
		this.electronService.ipcRenderer.send('showDockIcon', this.showDockIcon); // TODO: implement in the main process
	}

	/**
	 * Save list with prefered languages
	 */
	setPreferedLanguageList() {
		localStorage.setItem('languages', String(this.languages));
		localStorage.setItem('preferedLanguageList', JSON.stringify(this.preferedLangList));
	}

	/**
	 * Save Yandex Translate API key to the localstorage
	 * @param value option value ('apiKey')
	 * @param option name of the option 
	 */
	saveApiKey(value: string, option: string) {
		localStorage.setItem(option, value);
		AppSettings.API_KEY = value;
		this.validateApiKey();
		this.setAutoLaunch(); // TODO: combine to one IPCrenderer-request
		this.setAlwaysOnTop();
		this.setShowDockIcon();
		this.setPreferedLanguageList();
	}

	/**
	 * Use getLangs API method to validate API key
	 */
	validateApiKey() {
		const l$ = this.translateService.getLanguagesList();
		l$.subscribe(
			response => {
				this.router.navigate(['/home']);
				// let myNotification = new Notification('Oversetter', {
				// 	body: 'Settings were saved'
				// });
			},
			err => this.errorMessage = err
		);
	}

	/**
	 * Close application
	 */
	closeApp() {
		this.electronService.remote.app.quit();
	}

	/**
	 * Add one or multiple language(-s) to the prefered language list
	 * @param language string or array with language list as strings
	 */
	addLanguage(language) {
		if (!language) { return; }
		
		if(typeof language === 'string') {
			this.preferedLangList[language] = this.langList[language];
		}
		else {
			for (let i = 0; i < language.length; i++) {
				this.preferedLangList[language[i]] = this.langList[language[i]];
			}
		}
	}

	/**
	 * Remove one or multiple selected language(-s) from prefered language list
	 * @param language selected one or multiple languages (array or string)
	 */
	removeLanguage(language) {
		if (!language || Object.keys(this.preferedLangList).length <= 1) { return; }

		if(typeof language === 'string') {
			delete this.preferedLangList[language];
		}
		else {
			for (let i = 0; i < language.length; i++) {
				this.removeLanguage(language[i]);
			}
		}
		
	}

	languageState() {
		if (this.languages === 'all-languages') {
			return true;
		}
		else {
			return false;
		}
	  }

}