import { Component, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../translate.service';
import { AppSettings } from '../appsettings';

@Component({
	providers: [TranslateService],
	templateUrl: 'settings.component.html'
})

export class SettingsComponent {
	public apiKey: String;
	public errorMessage: String = '';

	/**
	 * Constructor function - set API key from the localstorage
	 * @param translateService translation service object
	 * @param router router object
	 */
	constructor(private translateService: TranslateService, private router: Router) {
		this.apiKey = AppSettings.API_KEY;
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


}