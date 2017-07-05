import {Component, Pipe, PipeTransform} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from './translate.service';
import {Translation} from './translation';
import {AppSettings} from './appsettings';


@Component({
	providers: [TranslateService],
	templateUrl: 'settings.component.html'
})

export class SettingsComponent {
	public translation:Translation;
	public langs:String[] = [];
	public settings:JSON[] = [];
	public view:string = 'main';

	/**
	 * 
	 * @param translateService translation service object
	 * @param router router object
	 */
	constructor(private translateService:TranslateService, private router:Router) {}

	/**
	 * 
	 * @param value option value
	 * @param option name of the option 
	 */
	saveApiKey(value:string, option:string) {
		localStorage.setItem(option, value);
		AppSettings.API_KEY = value;
		
		this.requestLanguageList();

		let myNotification = new Notification('Oversetter', {
			body: 'Settings were saved'
		})
	}

	requestLanguageList() {
		const l$ = this.translateService.getLanguagesList();
		l$.subscribe(
			response => {
				this.langs = response['langs'];
				this.router.navigate(['/home']);
			},
			response => {
				if (response.status === 0)
					console.error("No internet connection");
				// TODO: Error handling;
				// 1. wrong API-Key
				// 2. no internet connection
			}
		);
	}

}