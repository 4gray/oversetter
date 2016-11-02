import {Component, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from './translate.service';
import {Translation} from './translation';
import {AppSettings} from './appsettings';


@Component({
	selector: 'my-app',
	providers: [TranslateService],
	templateUrl: 'main.component.html'
})

export class MainComponent {
	public translation:Translation;
	public langs:String[] = [];
	public apiKey:string = '';
	public settings:JSON[] = [];
	public view:string = 'main';

	constructor(private translateService:TranslateService) {

		// store last used translation direction in localstorage
		if (localStorage.getItem('fromLang'))
			this.settings['fromLang'] = localStorage.getItem('fromLang');
		if (localStorage.getItem('toLang'))
			this.settings['toLang'] = localStorage.getItem('toLang');
		 if (localStorage.getItem('apiKey')) {
			this.apiKey = localStorage.getItem('apiKey');
			AppSettings.API_KEY = localStorage.getItem('apiKey');
		}

		console.log(AppSettings.API_KEY);

		if (AppSettings.API_KEY == '') {
			this.view = 'settings';
		}
		else {
			this.requestLanguageList();
		}
	}

	requestLanguageList() {
		const l$ = this.translateService.getLanguagesList();
		l$.subscribe(
			response => {
				this.langs = response['langs'];
			},
			response => {

				if (response.status === 0)
					console.error("No internet connection");
				// error handling; wrong API-Key, no internet connection
			}
		);
	}

	changeTranslationDir() {
		var temp = this.settings['fromLang'];
		this.settings['fromLang'] = this.settings['toLang'];
		this.settings['toLang'] = temp;
	}

	onSettingsChange(value:string, option:string) {
		localStorage.setItem(option, value);
	    this.settings[option] = value;

	    if (option === 'apiKey') {
	    	AppSettings.API_KEY = value;
	    	console.log(AppSettings.API_KEY);
	    	this.translateService.setApiKey();
	    	this.requestLanguageList();
	    }
	}

	toggleSettings() {

		if (this.view === 'settings')
			this.view = '';
		else
			this.view = 'settings';
	}

	translate(word:string) {
		var temp = word.replace(/\n/g, " "); // check for new line characters
		if (!/^ *$/.test(temp)) {
			this.translateService.getTranslation(word, this.settings['fromLang'], this.settings['toLang'])
				.subscribe(
					(translation: Translation) => this.translation = translation,
					error => console.error(`Error:  ${error}`),
					() => {
						console.log(`Completed! -- ${this.translation}`);
						console.log(this.translation.text);
					}
				);
		}
		else {
			this.translation = null;
		}
	}

}