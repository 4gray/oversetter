import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { TranslateService } from '@services/translate.service';
import { Translation } from '@models/translation';
import { DictionaryItem } from '@app/models/dictionary-item';
import { Language } from '@app/models/language';
import { StorageService } from '@app/services/storage.service';
import { of, Subject, Observable } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, flatMap, map, filter } from 'rxjs/operators';
import { SettingsService } from '@app/services/settings.service';
import { UiService } from '@app/services/ui.service';


@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})

export class MainComponent {
    /**
     * Translated word/phrase/sentence
     *
     * @type {Translation}
     * @memberof MainComponent
     */
    public translation: Translation;

    /**
     * List of languages for "translate from" dropdown
     *
     * @type {Language[]}
     * @memberof MainComponent
     */
    public languageListFrom: Observable<Language[]>;

    /**
     * List of languages for "translate to" dropdown
     *
     * @type {Observable<Language[]>}
     * @memberof MainComponent
     */
    public languageListTo: Observable<Language[]>;

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

    /**
     * Word/phrase to translate
     *
     * @memberof MainComponent
     */
    public word = '';

    /**
     * Update checker flag
     *
     * @memberof MainComponent
     */
    public updateAvailable = false;

    /**
     * Is word/phrase saved as favorite
     *
     * @memberof MainComponent
     */
    public wordFavorited = false;

    /**
     * Menu visibility flag
     *
     * @memberof MainComponent
     */
    public showMoreMenu = false;

    /**
     * Textarea key up listener
     *
     * @memberof MainComponent
     */
    public keyUp = new Subject<string>();


    /**
     * Creates an instance of MainComponent.
     * @param {SettingsService} settingsService settings service
     * @param {TranslateService} translateService translateion service
     * @param {StorageService} storageService storage service
     * @param {UiService} uiService UI service
     * @param {Router} router angular router
     * @param {ElectronService} electronService electron service
     * @param {NgZone} ngZone
     * @memberof MainComponent
     */
    constructor(
        private settingsService: SettingsService,
        private translateService: TranslateService,
        private storageService: StorageService,
        private uiService: UiService,
        private router: Router,
        private electronService: ElectronService,
        private ngZone: NgZone) {

        if (electronService.remote) {
            this.setElectronListeners();
        }

        this.fromLang = this.settingsService.getFromLang();
        this.toLang = this.settingsService.getToLang();

        this.requestLanguageList();

        this.keyUp.pipe(
            map((event: KeyboardEvent) => event.target['value']),
            debounceTime(250),
            distinctUntilChanged(),
            flatMap(search => of(search).pipe(delay(500)))
        ).subscribe(
            (text: string) => this.translate(text, this.fromLang.$key, this.toLang.$key)
        );
    }

    /**
     * Sets electron ipc renderers listeners
     *
     * @private
     * @memberof MainComponent
     */
    private setElectronListeners() {
        const window = this.electronService.remote.getCurrentWindow();

        if (window['dialog'] === 'about') {
            this.router.navigate(['/about']);
        } else if (window['dialog'] === 'dictionary') {
            this.router.navigate(['/dictionary']);
        }

        // translate content from clipboard
        this.electronService.ipcRenderer.on('translate-clipboard', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/home']);
                const clipboardText = this.electronService.clipboard.readText();
                this.word = clipboardText;
                this.translate(this.word, this.fromLang.$key, this.toLang.$key);
            });
        });

        // clear translation area
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
                this.router.navigate(['/settings'], { queryParams: { 'tab': 'about' } });
            });
        });
    }

    /**
     * Change translation direction
     *
     * @memberof MainComponent
     */
    public changeTranslationDir(): void {
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
    public onLanguageChange(langDirection: string, selectedLanguage: Language): void {
        this.settingsService.setLanguage(langDirection, selectedLanguage);

        if (langDirection === 'toLang' && this.word !== '') {
            this.translate(this.word, this.fromLang.$key, this.toLang.$key);
        }
    }

    /**
     * Translate text
     *
     * @param word string to translate
     */
    public translate(word: string, fromLang: string, toLang: string): void {
        const temp = word.replace(/\n/g, ' '); // check for new line characters
        let detectedLanguage = '';
        if (!/^ *$/.test(temp)) {
            if (fromLang === 'ad') {
                this.translateService
                    .detectLanguage(word, fromLang, toLang)
                    .subscribe(
                        (language: string) => {
                            this.translate(word, language, toLang);
                            detectedLanguage = ' (' + language + ' -> ' + toLang + ')';
                        },
                        error => console.error(`Error:  ${error}`)
                    );
            } else {
                if (this.fromLang.$key !== 'ad') {
                    detectedLanguage = '';
                }
                this.translateService
                    .getTranslation(word, fromLang, toLang)
                    .subscribe(
                        (translation: Translation) => {
                            this.translation = translation;
                            this.translation.$text += detectedLanguage;
                            this.wordFavorited = false;
                        },
                        error => console.error(`Error:  ${error}`),
                        () => console.log(`Translation: ${this.translation.$text}`)
                    );
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

        const dictItem: DictionaryItem = {
            text: this.word,
            translation: this.translation.$text,
            fromLang: this.fromLang,
            toLang: this.toLang
        };
        this.vocabulary.push(dictItem);
        this.wordFavorited = true;
        this.storageService.updateVocabulary(this.vocabulary);
    }

    /**
     * Get list with all available languages from the API
     *
     * @memberof MainComponent
     */
    requestLanguageList(): void {
        this.languageListFrom = this.translateService.getLanguagesList().pipe(
            map((result: Language[]) => {
                result.unshift(new Language('ad', 'Auto-detect'));
                return result;
            }),
        );
        this.languageListTo = this.translateService.getLanguagesList();
    }


    /**
     * Opens given URL in external browser
     * @param url url of the website
     */
    openUrl(url: string): void {
        this.uiService.openUrl(url);
    }

    /**
     * Opens dictionary window
     *
     * @memberof MainComponent
     */
    showDictionary(): void {
        this.electronService.ipcRenderer.send('openDictionary');
        this.hideMenu();
    }

    /**
     * Closes the application
     *
     * @memberof MainComponent
     */
    closeApp(): void {
        this.uiService.closeApp();
    }

    /**
     * Closes more menu
     *
     * @memberof MainComponent
     */
    hideMenu(): void {
        this.showMoreMenu = false;
    }

}
