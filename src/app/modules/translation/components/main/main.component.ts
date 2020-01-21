import { Component, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { AppSettings } from '@models/appsettings';
import { TranslateService } from '@services/translate.service';
import { Translation } from '@models/translation';
import { DictionaryItem } from '@app/models/dictionary-item';
import { Language } from '@app/models/language';
import { StorageService } from '@app/services/storage.service';
import { UiService } from '@app/services/ui.service';
import { of, Subject, throwError } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, flatMap, map, catchError } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent implements OnDestroy {
    /**
     * Translated word/phrase/sentence
     *
     * @type {Translation}
     * @memberof MainComponent
     */
    public translation: Translation;

    /**
     * List of languages
     *
     * @type {Language[]}
     * @memberof MainComponent
     */
    public languageListFrom: Language[] = [];
    public languageListTo: Language[] = [];

    /**
     * Translate to the given language
     *
     * @type {Language}
     * @memberof MainComponent
     */
    public toLang: Language;

    /**
     * Translate from the given language
     *
     * @type {Language}
     * @memberof MainComponent
     */
    public fromLang: Language;

    /**
     * List with vocabularies
     *
     * @type {DictionaryItem[]}
     * @memberof MainComponent
     */
    public vocabulary: DictionaryItem[];

    public word = '';
    public updateAvailable = false;
    public detectedLanguage = '';
    public wordFavorited = false;
    public showMoreMenu = false;
    public showArrow = false;

    public keyUp = new Subject<string>();

    /**
     * Creates an instance of MainComponent.
     * @param {TranslateService} translateService
     * @param {StorageService} storageService
     * @param {UiService} uiService
     * @param {Router} router
     * @param {ElectronService} electronService
     * @param {NgZone} ngZone
     * @memberof MainComponent
     */
    constructor(
        private translateService: TranslateService,
        private storageService: StorageService,
        private uiService: UiService,
        private router: Router,
        private electronService: ElectronService,
        private ngZone: NgZone
    ) {
        if (electronService.remote) {
            const window = electronService.remote.getCurrentWindow();

            if (window['dialog'] === 'about') {
                this.router.navigate(['/about']);
            } else if (window['dialog'] === 'dictionary') {
                this.router.navigate(['/dictionary']);
            }

            this.setIpcListeners();

            this.showArrow = this.uiService.showArrow;
        }

        this.fromLang = this.storageService.getFromLanguage();
        this.toLang = this.storageService.getToLanguage();

        if (AppSettings.$apiKey === '' || AppSettings.$apiKey === null) {
            this.router.navigate(['/settings']);
        } else {
            this.requestLanguageList();
        }

        this.keyUp
            .pipe(
                map((event: any) => event.target['value']),
                debounceTime(250),
                distinctUntilChanged(),
                flatMap(search => of(search).pipe(delay(500))),
                catchError(err => throwError(err))
            )
            .subscribe((text: string) => this.translate(text, this.fromLang.$key, this.toLang.$key));
    }

    ngOnDestroy(): void {}

    setIpcListeners(): void {
        // translate content from clipboard
        this.electronService.ipcRenderer.on('translate-clipboard', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/home']);
                const clipboardText = this.electronService.clipboard.readText();
                this.word = clipboardText;
                this.translate(this.word, this.fromLang.$key, this.toLang.$key);
            });
        });

        // clear translate area
        this.electronService.ipcRenderer.on('translate', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/home']);
                this.word = '';
                if (this.translation) {
                    this.translation = null;
                }
            });
        });

        // show update text if new version of the application is available
        this.electronService.ipcRenderer.on('update-available', () => {
            this.ngZone.run(() => {
                this.updateAvailable = true;
            });
        });

        // show app settings
        this.electronService.ipcRenderer.on('show-settings', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/settings']);
            });
        });
    }

    /**
     * Change translation direction
     *
     * @memberof MainComponent
     */
    public changeTranslationDir() {
        const temp = this.fromLang;
        this.fromLang = this.toLang;
        this.toLang = temp;
        this.onLanguageChange('fromLang', this.fromLang);
        this.onLanguageChange('toLang', this.toLang);
    }

    /**
     * Update option value in the localstorage
     * @param langDirection name of the translation direction (toLang or fromlang)
     * @param value option value
     */
    public onLanguageChange(langDirection: string, value: Language) {
        localStorage.setItem(langDirection, JSON.stringify(value));
        // this[langDirection] = value;
        if (langDirection === 'toLang' && this.word !== '') {
            this.translate(this.word, this.fromLang.$key, this.toLang.$key);
        }
    }

    /**
     * Translate text
     *
     * @param word string to translate
     */
    public translate(word: string, fromLang: string, toLang: string) {
        const temp = word.replace(/\n/g, ' '); // check for new line characters
        if (!/^ *$/.test(temp)) {
            if (fromLang === 'ad') {
                this.translateService
                    .detectLanguage(word, fromLang, toLang)
                    .pipe(
                        untilDestroyed(this),
                        catchError(err => throwError(err))
                    )
                    .subscribe(
                        (language: string) => {
                            this.translate(word, language, toLang);
                            this.detectedLanguage = ' (' + language + ' -> ' + toLang + ')';
                        },
                        error => console.error(`Error:  ${error}`)
                    );
            } else {
                if (this.fromLang.$key !== 'ad') {
                    this.detectedLanguage = '';
                }
                this.translateService
                    .getTranslation(word, fromLang, toLang)
                    .pipe(
                        untilDestroyed(this),
                        catchError(err => throwError(err))
                    )
                    .subscribe((translation: Translation) => {
                        this.translation = translation;
                        this.translation.$text += this.detectedLanguage;
                        this.wordFavorited = false;
                    });
            }
        } else {
            this.translation = null;
        }
    }

    /**
     * Save entry to the dictionary
     *
     * @memberof MainComponent
     */
    saveToDictionary(): void {
        this.vocabulary = this.storageService.getVocabulary();

        const dictItem = new DictionaryItem(this.word, this.translation.$text, this.fromLang, this.toLang);
        this.vocabulary.push(dictItem);
        this.wordFavorited = true;
        this.storageService.updateVocabulary(this.vocabulary);
        this.storageService.dictionaryChange.next('updated');
    }

    /**
     * Get list with all available languages from the API
     *
     * @memberof MainComponent
     */
    requestLanguageList(): void {
        this.translateService
            .getLanguagesList()
            .pipe(
                untilDestroyed(this),
                catchError(err => throwError(err))
            )
            .subscribe((response: Language[]) => {
                if (localStorage.getItem('languages') === 'select-languages') {
                    // save fetched languages in localstorage
                    this.languageListFrom = JSON.parse(localStorage.getItem('preferedLanguageList'));
                    this.languageListFrom = this.languageListFrom.map(
                        (item: any) => new Language(item.key, item.value)
                    );
                    this.languageListTo = this.languageListFrom.map((item: any) => new Language(item.key, item.value));
                } else {
                    this.languageListFrom = response;

                    // deep copy
                    const temp = JSON.stringify(response);
                    this.languageListTo = JSON.parse(temp);
                    this.languageListTo = this.languageListFrom.map((item: any) => new Language(item.key, item.value));
                }

                this.languageListFrom.unshift(new Language('ad', 'Auto-detect'));
                AppSettings.$languageList = response;
            });
    }

    /**
     * Open given URL in external browser
     * @param url url of the website
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

    /**
     * Opens dictionary window
     *
     * @memberof MainComponent
     */
    showDictionary() {
        this.electronService.ipcRenderer.send('openDictionary');
        this.hideMenu();
    }

    /**
     * Closes the application
     *
     * @memberof MainComponent
     */
    closeApp() {
        this.electronService.remote.app.quit();
    }

    /**
     * Closes more menu
     *
     * @memberof MainComponent
     */
    hideMenu() {
        this.showMoreMenu = false;
    }
}
