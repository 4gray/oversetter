import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './appsettings';
import 'rxjs/add/operator/map';

import {Translation} from './translation';

@Injectable()
export class TranslateService {

	private apiKey:string = AppSettings.API_KEY;

	//private key = 'trnsl.1.1.20160306T121040Z.ce3153278463656c.38be842aceb435f1c023544f5571eb64e2c01fdf';
	private translateUrl:string;
	private languagesUrl:string;

	constructor(private http: Http) {
		this.setApiKey();
	}

    createRequest(word: string, fromLang: string, toLang: string) {
		return this.translateUrl + '&text='+encodeURIComponent(word)+'&lang='+fromLang+'-'+toLang;
    }

	getTranslation(word: string, fromLang: string, toLang: string): Observable<Translation> {
		let requestUrl = this.createRequest(word, fromLang, toLang);
		return this.http.get(requestUrl)
			.map( (response) => response.json() )
			.map( (response:Translation) => {
				return new Translation(response.code, response.lang, response.text);
		});
	}

	getLanguagesList():Observable<String[]> {
		return this.http.get(this.languagesUrl)
						.map(res => res.json());
	}

	setApiKey() {
		this.apiKey = AppSettings.API_KEY;
		this.translateUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+this.apiKey;
		this.languagesUrl = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key='+this.apiKey+'&ui=en';
	}

}