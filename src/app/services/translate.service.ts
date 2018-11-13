import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Translation } from '@models/translation';
import { Language } from '@app/models/language';
import { map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { SettingsService } from './settings.service';
import { Settings } from '@app/models/settings';

@Injectable()
export class TranslateService {

    SERVICE_URL = 'https://translate.yandex.net/api/v1.5/tr.json';
    settings: Settings;

    /**
     * Creates an instance of TranslateService.
     * @param {Http} http angular http module
     * @memberof TranslateService
     */
    constructor(private http: Http, private settingsService: SettingsService) {
        this.settings = this.settingsService.getSettings();
    }

    /**
     * Translate with Auto-detect
     *
     * @param {string} word word or phrase
     * @param {Language} fromLang from language
     * @returns
     * @memberof TranslateService
     */
    public detectLanguage(word: string, fromLang: string) {
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
     * Returns JSON list with prefered languages
     *
     * @returns {Language[]} language list
     * @memberof TranslateService
     */
    getPreferedLanguagesList(): Observable<Language[]> {
        return of(this.settingsService.getSettings().preferedLanguageList);
    }

    /**
     * Returns JSON list with available languages from Yandex API
     *
     * @returns {Observable<Language[]>}
     * @memberof TranslateService
     */
    public getLanguagesList(): Observable<Language[]> {
        return this.http.get(this.getLanguagesUrl())
            .map(res => res.json()['langs'])
            .map(res => this.sortLanguages(res))
            .pipe<Language[]>(
                catchError(this.handleError)
            );
    }

    /**
     * Sorts languages alphabetically
     *
     * @param {any} languages object with languages
     * @returns sorted array with language list
     * @memberof MainComponent
     */
    sortLanguages(languages) {
        const sortedLangs: Language[] = [];
        for (const key of Object.keys(languages)) {
            sortedLangs.push({
                key: key,
                value: languages[key]
            });
        }
        return sortedLangs.sort((a, b) => a.value.localeCompare(b.value));
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
            .map((response: Translation) => response)
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
        return this.SERVICE_URL + '/getLangs?key=' + this.settings.apiKey + '&ui=en';
    }

    /**
     * Return base part of URL for translation request
     */
    private getTranslateUrl() {
        return this.SERVICE_URL + '/translate?key=' + this.settings.apiKey;
    }

    /**
     * Return URL for auto detect API endpoint
     *
     * @private
     * @returns url as string
     * @memberof TranslateService
     */
    private getAutoDetectLanguageUrl() {
        return this.SERVICE_URL + '/detect?key=' + this.settings.apiKey;
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
        return throwError(result || 'Please check your network connection');

    }

}
