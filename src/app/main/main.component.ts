import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { TranslateService } from '../translate.service';
import { Translation } from '../translation';
import { AppSettings } from '../appsettings';

@Component({
	providers: [TranslateService],
	templateUrl: 'main.component.html'
})

export class MainComponent {
	public translation: Translation;
	public langs: Object = {};
	public settings: Object = {};
	//public view: string = 'main';
	public word: string = '';
	public updateAvailable: boolean = false;
	public detectedLanguage: string = '';
	public wordFavorited: boolean = false;

	constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService, private ngZone: NgZone) {
		let window = electronService.remote.getCurrentWindow();

		if(window['dialog'] === 'about') {
			this.router.navigate(['/about']);
		}
		else if(window['dialog'] === 'dictionary') {
			this.router.navigate(['/dictionary']);
		}

		// translate content from clipboard
		this.electronService.ipcRenderer.on('translate-clipboard', () => {
			this.ngZone.run(() => {
				this.router.navigate(['/home']);
				let clipboardText = this.electronService.clipboard.readText();
				this.word = clipboardText;
				this.translate(this.word, this.settings['fromLang'], this.settings['toLang']);
			});
		});

		// clear translate area
		this.electronService.ipcRenderer.on('translate', () => {
			this.ngZone.run(() => {
				this.router.navigate(['/home']);
				this.word = '';
				if (this.translation) {
					this.translation = null;
				}
			});
		});

		// show update text if new version of the application is available
		this.electronService.ipcRenderer.on('update-available', () => {
			this.ngZone.run(() => {
				this.updateAvailable = true;
			});
		});

		// show app settings
		this.electronService.ipcRenderer.on('show-settings', () => {
			this.ngZone.run(() => {
				this.router.navigate(['/settings']);
			});
		});

		this.settings['fromLang'] = localStorage.getItem('fromLang') || 'ad';
		this.settings['toLang'] = localStorage.getItem('toLang') || 'en';

		if (AppSettings.API_KEY === '' || AppSettings.API_KEY === null) {
			this.router.navigate(['/settings']);
		}
		else {
			this.requestLanguageList();
		}
	}


	/**
	 * Get list with all available languages from the API
	 */
	requestLanguageList() {
		const l$ = this.translateService.getLanguagesList();
		l$.subscribe(
			response => { 
				if (localStorage.getItem('languages') === 'select-languages') {
					this.langs = JSON.parse(localStorage.getItem('preferedLanguageList'));
				}
				else {
					this.langs = response['langs'];
				}
				AppSettings.LANGS = response['langs']; // TODO: save fetched languages in localstorage
			},
			error => console.error(error)
		);
	}

	/**
	 * Change translation direction
	 */
	changeTranslationDir() {
		let temp = this.settings['fromLang'];
		this.settings['fromLang'] = this.settings['toLang'];
		this.settings['toLang'] = temp;
	}

	/**
	 * Update option value in the localstorage
	 * @param value option value
	 * @param option name of the option
	 */
	onSettingsChange(value: string, option: string) {
		localStorage.setItem(option, value);
		this.settings[option] = value;
	}

	/**
	 * Translate text
	 * @param word string to translate
	 */
	translate(word: string, fromLang: string, toLang: string) {
		let temp = word.replace(/\n/g, " "); // check for new line characters
		if (!/^ *$/.test(temp)) {
			if (fromLang === 'ad') {
				this.translateService
					.detectLanguage(word, fromLang, toLang)
					.subscribe(
					(language: string) => {
						this.translate(word, language, toLang);
						this.detectedLanguage = ' (' + language + ' -> ' + toLang + ')';
					},
					error => console.error(`Error:  ${error}`)
					);
			}
			else {
				if (this.settings['fromLang'] !== 'ad') {
					this.detectedLanguage = '';
				}
				this.translateService
					.getTranslation(word, fromLang, toLang)
					.subscribe(
					(translation: Translation) => {
						this.translation = translation;
						this.translation.text += this.detectedLanguage;
						this.wordFavorited = false;
					},
					error => console.error(`Error:  ${error}`),
					() => console.log(`Translation: ${this.translation.text}`)
					);
			}
		}
		else {
			this.translation = null;
		}
	}

	saveToDictionary() {
		this.settings['vocabulary'] = JSON.parse(localStorage.getItem('vocabulary')) || [];
		this.settings['vocabulary'].push({
			text: this.word,
			translation: this.translation.text,
			fromLang: this.settings['fromLang'],
			toLang: this.settings['toLang']
		});	
		this.wordFavorited = true;
		localStorage.setItem('vocabulary', JSON.stringify(this.settings['vocabulary']));
	}

}