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
	public apiKey:string = '';
	public settings:JSON[] = [];
	public view:string = 'main';

	constructor(private translateService:TranslateService, private router:Router) {
		 if (localStorage.getItem('apiKey')) {
			this.apiKey = localStorage.getItem('apiKey');
			AppSettings.API_KEY = localStorage.getItem('apiKey');
		}
	}

	saveApiKey(value:string, option:string) {
		localStorage.setItem(option, value);
		this.settings[option] = value;

		if (option === 'apiKey') {
			AppSettings.API_KEY = value;
			console.log(AppSettings.API_KEY);
			this.translateService.setApiKey();
			this.requestLanguageList();
		}
	}

	requestLanguageList() {
		const l$ = this.translateService.getLanguagesList();
		l$.subscribe(
			response => {
				this.langs = response['langs'];
				this.router.navigate(['/main']);
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