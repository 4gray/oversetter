import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AppSettings } from '@models/appsettings';
import { Translation } from '@models/translation';
import { Language } from '@app/models/language';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TranslateService {

    SERVICE_URL = 'https://translate.yandex.net/api/v1.5/tr.json';

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
    public getLanguagesList(includeAutoDetect: boolean = false, storeType: string = 'languages'): Observable<Language[]> {
        // const langPreferences = localStorage.getItem(storeType);
        let data: Observable<Language[]>;

        if (storeType === 'select-languages') {
            data = of<Language[]>(JSON.parse(localStorage.getItem('preferedLanguageList')));
        } else {
            data = this.http.get(this.getLanguagesUrl())
                .map(res => this.sortLanguages(res.json()['langs']));
        }

        return data.pipe<Language[]>(
            map((result: Language[]) => {
                if (includeAutoDetect) {
                    result.unshift(new Language('ad', 'Auto-detect'));
                }
                /* if (result === null) {
                    result = [];
                } */
                return result.map((item: any) => new Language(item.key, item.value)) || [];
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Sort languages
     *
     * @param {any} languages object with languages
     * @returns sorted array with language list
     * @memberof MainComponent
     */
    sortLanguages(languages) {
        let sortedLangs = [];
        // tslint:disable-next-line:forin
        for (const key in languages) {
            sortedLangs.push({
                key: key,
                value: languages[key]
            });
        }

        sortedLangs.sort((a, b) => a.value.localeCompare(b.value));
        sortedLangs = sortedLangs.map(item => {
            return new Language(item.key, item.value);
        });

        return sortedLangs;
    }

    /**
     * Return translation result
     * @param word Phrase to translate
     * @param fromLang Origin language
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
        return this.SERVICE_URL + '/getLangs?key=' + AppSettings.$apiKey + '&ui=en';
    }

    /**
     * Return base part of URL for translation request
     */
    private getTranslateUrl() {
        return this.SERVICE_URL + '/translate?key=' + AppSettings.$apiKey;
    }

    /**
     * Return URL for auto detect API endpoint
     *
     * @private
     * @returns url as string
     * @memberof TranslateService
     */
    private getAutoDetectLanguageUrl() {
        return this.SERVICE_URL + '/detect?key=' + AppSettings.$apiKey;
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
