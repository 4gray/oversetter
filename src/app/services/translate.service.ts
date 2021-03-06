import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language } from '@app/models/language';
import * as fromConfig from '@app/store/reducers';
import { Translation } from '@models/translation';
import { select, Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TranslateService {
    /** URL of the Yandex API */
    SERVICE_URL = 'https://translate.yandex.net/api/v1.5/tr.json';

    /** Yandex Translate API key */
    apiKey: string;

    /**
     * Creates an instance of TranslateService.
     * @param http angular http module
     */
    constructor(private http: HttpClient, private store: Store) {
        this.store.pipe(select(fromConfig.getConfig)).subscribe(config => {
            this.apiKey = config.apiKey;
        });
    }

    /**
     * Auto-detects language of the given word/phrase
     * @param word word or phrase to translate
     * @param fromLang from language as code
     * @param toLang to language as code
     */
    detectLanguage(word: string, fromLang: string): Observable<any> {
        const requestUrl = this.createRequest(word, fromLang);
        return this.http.get<any>(requestUrl).pipe(
            map(response => {
                console.log(`Detected language: ${response.lang}`);
                return response.lang;
            }),
            catchError(err => this.handleError(err))
        );
    }

    /**
     * Return json list with available languages from Yandex API
     */
    getLanguagesList(): Observable<Language[]> {
        return this.http.get<any>(this.getLanguagesUrl()).pipe(
            map(res => this.sortLanguages(res.langs)),
            catchError(err => this.handleError(err))
        );
    }

    /**
     * Sort languages
     *
     * @param languages object with languages
     * @returns sorted array with language list
     */
    sortLanguages(languages: any): Language[] {
        let sortedLangs = [];
        // tslint:disable-next-line:forin
        for (const key in languages) {
            sortedLangs.push({
                key: key,
                value: languages[key],
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
    getTranslation(word: string, fromLang: string, toLang: string): Observable<Translation> {
        const requestUrl = this.createRequest(word, fromLang, toLang);
        return this.http.get<any>(requestUrl).pipe(
            map(response => {
                return new Translation(response.code, response.lang, response.text);
            }),
            catchError(err => this.handleError(err))
        );
    }

    /**
     * Create translation request
     * @param word translation word or phrase
     * @param fromLang code for from language
     * @param toLang code for to language
     */
    // tslint:disable-next-line:no-unnecessary-initializer
    createRequest(word: string, fromLang: string = undefined, toLang: string = undefined): any {
        if (fromLang === 'ad') {
            // auto-detect is selected
            return this.getAutoDetectLanguageUrl() + '&text=' + encodeURIComponent(word);
        } else {
            return this.getTranslateUrl() + '&text=' + encodeURIComponent(word) + '&lang=' + fromLang + '-' + toLang;
        }
    }

    /**
     * Return URL for language request from Yandex Translate API
     */
    getLanguagesUrl(): string {
        return this.SERVICE_URL + '/getLangs?key=' + this.apiKey + '&ui=en';
    }

    /**
     * Return base part of URL for translation request
     */
    getTranslateUrl(): string {
        return this.SERVICE_URL + '/translate?key=' + this.apiKey;
    }

    /**
     * Return URL for auto detect API endpoint
     */
    getAutoDetectLanguageUrl(): string {
        return this.SERVICE_URL + '/detect?key=' + this.apiKey;
    }

    /**
     * Handle API errors
     * @param errorResponse error response object
     */
    private handleError(errorResponse: HttpErrorResponse): Observable<any> {
        console.error(errorResponse);
        return throwError(errorResponse.error.message || 'Please check your network connection');
    }
}
