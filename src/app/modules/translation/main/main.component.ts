import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { AppSettings } from '@models/appsettings';
import { TranslateService } from '@services/translate.service';
import { Translation } from '@models/translation';

@Component({
    templateUrl: 'main.component.html'
})

export class MainComponent {
    public translation: Translation;
    public langs = {};
    public settings = {};
    public word = '';
    public updateAvailable = false;
    public detectedLanguage = '';
    public wordFavorited = false;

    // tslint:disable-next-line:max-line-length
    constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService, private ngZone: NgZone) {
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
                this.translate(this.word, this.settings['fromLang'], this.settings['toLang']);
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

        this.settings['fromLang'] = localStorage.getItem('fromLang') || 'ad';
        this.settings['toLang'] = localStorage.getItem('toLang') || 'en';

        if (AppSettings.$API_KEY === '' || AppSettings.$API_KEY === null) {
            this.router.navigate(['/settings']);
        } else {
            this.requestLanguageList();
        }
    }

    /**
     * Change translation direction
     */
    public changeTranslationDir() {
        const temp = this.settings['fromLang'];
        this.settings['fromLang'] = this.settings['toLang'];
        this.settings['toLang'] = temp;
    }

    /**
     * Update option value in the localstorage
     * @param value option value
     * @param option name of the option
     */
    public onSettingsChange(value: string, option: string) {
        localStorage.setItem(option, value);
        this.settings[option] = value;
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
                if (this.settings['fromLang'] !== 'ad') {
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
        this.settings['vocabulary'] = JSON.parse(localStorage.getItem('vocabulary')) || [];
        this.settings['vocabulary'].push({
            text: this.word,
            translation: this.translation.$text,
            fromLang: this.settings['fromLang'],
            toLang: this.settings['toLang']
        });
        this.wordFavorited = true;
        localStorage.setItem('vocabulary', JSON.stringify(this.settings['vocabulary']));
    }

    /**
     * Get list with all available languages from the API
     */
    private requestLanguageList() {
        const l$ = this.translateService.getLanguagesList();
        l$.subscribe(
            response => {
                if (localStorage.getItem('languages') === 'select-languages') {
                    this.langs = JSON.parse(localStorage.getItem('preferedLanguageList'));
                } else {
                    this.langs = response['langs'];
                }
                AppSettings.$LANGS = response['langs']; // TODO: save fetched languages in localstorage
            },
            error => console.error(error)
        );
    }


    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

}
