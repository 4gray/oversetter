import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AppSettings } from './appsettings';

import { Translation } from './translation';

@Injectable()
export class TranslateService {

    /**
     * Creates an instance of TranslateService.
     * @param {Http} http angular http module
     * @memberof TranslateService
     */
    constructor(private http: Http) { }

    public detectLanguage(word, fromLang, toLang) {
        const requestUrl = this.createRequest(word, fromLang);
        return this.http.get(requestUrl)
            .map(response => response.json())
            .map(response => {
                console.log(`Detected language: ${response.lang}`);
                return response.lang;
            })
            .catch(this.handleError);
    }

    /**
     * Return json list with available languages from yandex api
     */
    public getLanguagesList(): Observable<string[]> {
        return this.http.get(this.getLanguagesUrl())
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * Return translation result
     * @param word Word or sentence to translate
     * @param fromLang  Origin language
     * @param toLang Result language
     */
    public getTranslation(word: string, fromLang: string, toLang: string): Observable<Translation> {
        const requestUrl = this.createRequest(word, fromLang, toLang);
        return this.http.get(requestUrl)
            .map(response => response.json())
            .map(response => {
                return new Translation(response.code, response.lang, response.text);
            })
            .catch(this.handleError);

    }

    /**
     * Create translation request
     * @param word translation word or phrase
     * @param fromLang code for from language
     * @param toLang code for to language
     */
    // tslint:disable-next-line:no-unnecessary-initializer
    private createRequest(word: string, fromLang: string = undefined, toLang: string = undefined) {
        if (fromLang === 'ad') { // auto-detect is selected
            return this.getAutoDetectLanguageUrl() + '&text=' + encodeURIComponent(word);
        } else {
            return this.getTranslateUrl() + '&text=' + encodeURIComponent(word) + '&lang=' + fromLang + '-' + toLang;
        }
    }

    /**
     * Return URL for language request from Yandex Translate API
     */
    private getLanguagesUrl() {
        return 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=' + AppSettings.API_KEY + '&ui=en';
    }

    /**
     * Return base part of URL for translation request
     */
    private getTranslateUrl() {
        return 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + AppSettings.API_KEY;
    }

    /**
     * Return URL for auto detect API endpoint
     *
     * @private
     * @returns url as string
     * @memberof TranslateService
     */
    private getAutoDetectLanguageUrl() {
        return 'https://translate.yandex.net/api/v1.5/tr.json/detect?key=' + AppSettings.API_KEY;
    }

    /**
     * Handle API errors
     * @param err error object
     */
    private handleError(err) {
        let errMessage: string;
        let result;

        if (err instanceof Response) {
            const body = err.json() || '';
            const error = body.error || JSON.stringify(body);
            errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
            result = body.message;
        } else {
            errMessage = err.message ? err.message : err.toString();
            result = errMessage;
        }

        console.error(errMessage);
        return Observable.throw(result || 'Please check your network connection');

    }

}
