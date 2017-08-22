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
	public autolaunch: Boolean;
	public activeTab: number = 1;

	/**
	 * Constructor function - set API key from the localstorage
	 * @param translateService translation service object
	 * @param router router object
	 */
	constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService) {
		this.apiKey = AppSettings.API_KEY;
		if (localStorage.getItem('autolaunch')) {
			this.autolaunch = (localStorage.getItem('autolaunch') === 'true');
		}
		else {
			this.autolaunch = false; // default is false
		}
	}

	/**
	 * Save auto launch options
	 */
	setAutoLaunch() {
		localStorage.setItem('autolaunch', String(this.autolaunch));
		this.electronService.ipcRenderer.send('autolaunch', this.autolaunch);
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
		this.setAutoLaunch();
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
	 * Change active tab in the settings layout
	 * @param tab id of the tab
	 */
	changeSettingsTab(tab: number) {
		this.activeTab = tab;
	}


}