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
	public langs: String[] = [];
	public settings: JSON[] = [];
	public view: string = 'main';
	public word: string = '';
	public updateAvailable: boolean = false;

	constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService, private ngZone: NgZone) {

		// translate content from clipboard
		this.electronService.ipcRenderer.on('translate-clipboard', () => {
			this.ngZone.run(() => {
				let clipboardText = this.electronService.clipboard.readText();
				this.word = clipboardText;
				this.translate(this.word);
			});
		});

		// clear translate area
		this.electronService.ipcRenderer.on('translate', () => {
			this.ngZone.run(() => {
				this.word = '';
				if (this.translation) {
					this.translation = null;
				}
			});
		});

		this.electronService.ipcRenderer.on('update-available', () => {
			this.ngZone.run(() => {
				this.updateAvailable = true;
			});
		});

		// store last used translation direction in localstorage
		if (localStorage.getItem('fromLang')) {
			this.settings['fromLang'] = localStorage.getItem('fromLang');
		}
		if (localStorage.getItem('toLang')) {
			this.settings['toLang'] = localStorage.getItem('toLang');
		}
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
			response => this.langs = response['langs'],
			error => console.error(error)
		);
	}

	/**
	 * Change translation direction
	 */
	changeTranslationDir() {
		var temp = this.settings['fromLang'];
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
	translate(word: string) {
		var temp = word.replace(/\n/g, " "); // check for new line characters
		if (!/^ *$/.test(temp)) {
			this.translateService.getTranslation(word, this.settings['fromLang'], this.settings['toLang'])
				.subscribe(
				(translation: Translation) => this.translation = translation,
				error => console.error(`Error:  ${error}`),
				() => console.log(`Translation: ${this.translation.text}`)
				);
		}
		else {
			this.translation = null;
		}
	}

}