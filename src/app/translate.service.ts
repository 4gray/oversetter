import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from './appsettings';
import 'rxjs/add/operator/map';

import {Translation} from './translation';

@Injectable()
export class TranslateService {

	constructor(private http: Http) { }

	/**
	 * Create translation request
	 * @param word 
	 * @param fromLang 
	 * @param toLang 
	 */
    createRequest(word: string, fromLang: string, toLang: string) {
		return this.getTranslateUrl() + '&text='+encodeURIComponent(word) + '&lang=' + fromLang + '-' + toLang;
    }

	/**
	 * Return result of translation
	 * @param word Word or sentence to translate
	 * @param fromLang  Origin language
	 * @param toLang Result language
	 */
	getTranslation(word: string, fromLang: string, toLang: string): Observable<Translation> {
		let requestUrl = this.createRequest(word, fromLang, toLang);
		return this.http.get(requestUrl)
			.map( (response) => response.json() )
			.map( (response:Translation) => {
				return new Translation(response.code, response.lang, response.text);
		});
	}

	/**
	 * Return json list with available languages from yandex api
	 */
	getLanguagesList():Observable<String[]> {
		return this.http.get(this.getLanguagesUrl())
						.map(res => res.json());
	}

	/**
	 * Return URL for language request from Yandex Translate API
	 */
	getLanguagesUrl() {
		return 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key='+ AppSettings.API_KEY +'&ui=en';
	}

	/**
	 * Return base part of URL for translation request
	 */
	getTranslateUrl() {
		return 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+ AppSettings.API_KEY;
	}

}