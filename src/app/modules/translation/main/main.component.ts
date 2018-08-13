import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { AppSettings } from '@models/appsettings';
import { TranslateService } from '@services/translate.service';
import { Translation } from '@models/translation';
import { DictionaryItem } from '@app/models/dictionary-item';
import { Settings } from '@app/models/settings';
import { Language } from '@app/models/language';
import { StorageService } from '@app/services/storage.service';
import { UiService } from '@app/services/ui.service';

@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})

export class MainComponent {
    public translation: Translation;
    public langs: Language[] = [];
    public settings: Settings = {
        toLang: null,
        fromLang: null,
        vocabulary: null
    };
    public word = '';
    public updateAvailable = false;
    public detectedLanguage = '';
    public wordFavorited = false;
    public showMoreMenu = false;
    public showArrow = false;

    constructor(private translateService: TranslateService,
        private storageService: StorageService,
        private uiService: UiService,
        private router: Router,
        private electronService: ElectronService,
        private ngZone: NgZone) {

        if (electronService.remote) {

            const window = electronService.remote.getCurrentWindow();

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
                    this.translate(this.word, this.settings.fromLang.$key, this.settings.toLang.$key);
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

            this.showArrow = this.uiService.showArrow;
        }

        this.settings.fromLang = this.storageService.getFromLanguage();
        this.settings.toLang = this.storageService.getToLanguage();

        if (AppSettings.$API_KEY === '' || AppSettings.$API_KEY === null) {
            this.router.navigate(['/settings']);
        } else {
            this.requestLanguageList();
        }
    }

    /**
     * Change translation direction
     *
     * @memberof MainComponent
     */
    public changeTranslationDir() {
        const temp = this.settings.fromLang;
        this.settings['fromLang'] = this.settings.toLang;
        this.settings['toLang'] = temp;
    }

    /**
     * Update option value in the localstorage
     * @param langDirection name of the translation direction (toLang or fromlang)
     * @param value option value
     */
    public onLanguageChange(langDirection: string, value: Language) {
        localStorage.setItem(langDirection, JSON.stringify(value));
        this.settings[langDirection] = value;
    }

    /**
     * Translate text
     * @param word string to translate
     */
    public translate(word: string, fromLang: string, toLang: string) {
        const temp = word.replace(/\n/g, ' '); // check for new line characters
        if (!/^ *$/.test(temp)) {
            if (fromLang === 'ad') {
                this.translateService
                    .detectLanguage(word, fromLang, toLang)
                    .subscribe(
                        (language: string) => {
                            this.translate(word, language, toLang);
                            this.detectedLanguage = ' (' + language + ' -> ' + toLang + ')';
                        },
                        error => console.error(`Error:  ${error}`)
                    );
            } else {
                if (this.settings.fromLang.$key !== 'ad') {
                    this.detectedLanguage = '';
                }
                this.translateService
                    .getTranslation(word, fromLang, toLang)
                    .subscribe(
                        (translation: Translation) => {
                            this.translation = translation;
                            this.translation.$text += this.detectedLanguage;
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
    public saveToDictionary() {
        this.settings.vocabulary = this.storageService.getVocabulary();
        console.log(this.settings.vocabulary);

        const dictItem = new DictionaryItem(this.word, this.translation.$text, this.settings.fromLang, this.settings.toLang);
        this.settings.vocabulary.push(dictItem);
        this.wordFavorited = true;
        this.storageService.updateVocabulary(this.settings['vocabulary']);
    }

    /**
     * Get list with all available languages from the API
     */
    private requestLanguageList() {
        this.translateService.getLanguagesList().subscribe(
            response => {
                const sorted = this.sortLanguages(response);
                if (localStorage.getItem('languages') === 'select-languages') {
                    // save fetched languages in localstorage
                    this.langs = JSON.parse(localStorage.getItem('preferedLanguageList'));
                } else {
                    this.langs = sorted;
                }
                AppSettings.$LANGS = sorted;
            },
            error => console.error(error)
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
     * Open given URL in external browser
     * @param url url of the website
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

    /**
     * Open dictionary window
     */
    showDictionary() {
        this.electronService.ipcRenderer.send('openDictionary');
        this.showMoreMenu = false;
    }

    showAbout() {
        this.electronService.ipcRenderer.send('openAbout');
        this.showMoreMenu = false;
    }

    /**
     * Close application
     */
    closeApp() {
        this.electronService.remote.app.quit();
    }

}
