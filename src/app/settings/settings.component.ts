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
	public activeTab: number = 1;
	public autolaunch: boolean = false;
	public alwaysOnTop: boolean = false;
	public showDockIcon: boolean = false;

	/**
	 * Constructor function - set API key from the localstorage
	 * @param translateService translation service object
	 * @param router router object
	 */
	constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService) {
		console.log('settings instance created');
		this.apiKey = AppSettings.API_KEY;
		if (localStorage.getItem('autolaunch')) {
			this.autolaunch = (localStorage.getItem('autolaunch') === 'true');
		}

		if (localStorage.getItem('alwaysOnTop')) {
			this.alwaysOnTop = (localStorage.getItem('alwaysOnTop') === 'true');
		}

		if (localStorage.getItem('showDockIcon')) {
			this.showDockIcon = (localStorage.getItem('showDockIcon') === 'true');
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
	 * Save Yandex Translate API key to the localstorage
	 * @param value option value ('apiKey')
	 * @param option name of the option 
	 */
	saveApiKey(value: string, option: string) {
		localStorage.setItem(option, value);
		AppSettings.API_KEY = value;
		this.validateApiKey();
		this.setAutoLaunch();
		this.setAlwaysOnTop();
		this.setShowDockIcon();
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