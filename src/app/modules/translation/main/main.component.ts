import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    public languageListFrom: Language[];

    /**
     * List of languages for "translate to" dropdown
     *
     * @type {Observable<Language[]>}
     * @memberof MainComponent
     */
    public languageListTo: Language[];

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
        private ngZone: NgZone,
        private route: ActivatedRoute) {

        if (electronService.remote) {
            this.setElectronListeners();
        }

        this.fromLang = this.settingsService.getFromLang();
        this.toLang = this.settingsService.getToLang();

        this.languageListFrom = [
            ...[{ key: 'ad', value: 'Auto-detect' }],
            ...this.route.snapshot.data.languages
        ];
        this.languageListTo = [...this.route.snapshot.data.languages];

        this.keyUp.pipe(
            map((event: KeyboardEvent) => event.target['value']),
            debounceTime(250),
            distinctUntilChanged(),
            flatMap(search => of(search).pipe(delay(500)))
        ).subscribe(
            (text: string) => this.handleTranslation(text, this.fromLang.key, this.toLang.key)
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
                this.handleTranslation(this.word, this.fromLang.key, this.toLang.key);
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
            this.handleTranslation(this.word, this.fromLang.key, this.toLang.key);
        }
    }

    /**
     * Auto-detect language
     *
     * @param {string} word string to translate
     * @param {string} fromLang from language
     * @param {string} toLang to language
     * @memberof MainComponent
     */
    detectLanguage(word: string, fromLang: string, toLang: string): void {
        this.translateService
            .detectLanguage(word, fromLang)
            .subscribe(
                (detectedLang: string) => this.handleTranslation(word, detectedLang, toLang),
                error => console.error(`Error:  ${error}`)
            );
    }

    /**
     * Translates the given string
     *
     * @param {string} word string to translate
     * @param {string} fromLang from language
     * @param {string} toLang to language
     * @memberof MainComponent
     */
    translate(word: string, fromLang: string, toLang: string): void {
        this.translateService
            .getTranslation(word, fromLang, toLang)
            .subscribe(
                (translation: Translation) => {
                    this.translation = translation;
                    this.translation.text += ' (' + fromLang + '->' + toLang + ')';
                    this.wordFavorited = false;
                },
                error => console.error(`Error:  ${error}`),
                () => console.log(`Translation: ${this.translation.text}`)
            );
    }

    /**
     * Handles translation
     *
     * @param {string} word string to translate
     * @param {string} fromLang from language
     * @param {string} toLang to language
     * @memberof MainComponent
     */
    public handleTranslation(word: string, fromLang: string, toLang: string): void {
        const temp = word.replace(/\n/g, ' '); // check for new line characters

        if (!/^ *$/.test(temp)) {
            if (fromLang === 'ad') {
                this.detectLanguage(word, fromLang, toLang);
            } else {
                this.translate(word, fromLang, toLang);
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
            translation: this.translation.text,
            fromLang: this.fromLang,
            toLang: this.toLang
        };
        this.vocabulary.push(dictItem);
        this.wordFavorited = true;
        this.storageService.updateVocabulary(this.vocabulary);
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
