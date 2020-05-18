import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import { DictionaryItem } from '@app/models/dictionary-item';
import { Language } from '@app/models/language';
import { StorageService } from '@app/services/storage.service';
import { ThemeService } from '@app/services/theme.service';
import { updateConfig } from '@app/store/actions/config.actions';
import * as fromConfig from '@app/store/reducers';
import { ConfigState, LanguageMode } from '@app/store/reducers/config.reducer';
import { Translation } from '@models/translation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@services/translate.service';
import { of, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, flatMap, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
})
export class MainComponent {
    /** Translated word/phrase/sentence */
    translation: Translation;
    /** List of languages for 'translate from' dropdown */
    languageListFrom: Language[] = [];
    /** List of languages for 'translate to' dropdown */
    languageListTo: Language[] = [];
    /** List with vocabularies */
    vocabulary: DictionaryItem[];
    /** Entered text to translate */
    enteredText = '';
    /** Update flag */
    updateAvailable = false;
    /** Label with detected language */
    detectedLanguage = '';
    /** Favorite flag */
    isFavorited = false;
    /** Menu flag */
    showMoreMenu = false;
    /** Key up listener */
    keyUp = new Subject<string>();
    /** Application config object */
    appConfig: ConfigState;

    /**
     * Creates an instance of MainComponent
     * @param translateService
     * @param storageService
     * @param router angulars router
     * @param electronService
     * @param ngZone
     * @param themeService theme service
     * @param store ngrx store
     */
    constructor(
        private translateService: TranslateService,
        private storageService: StorageService,
        private router: Router,
        private electronService: ElectronService,
        private ngZone: NgZone,
        private themeService: ThemeService,
        private store: Store
    ) {
        if (electronService.remote) {
            this.setIpcListeners();
        }
        // get configuration of the application
        this.store.pipe(select(fromConfig.getConfig), untilDestroyed(this)).subscribe(config => {
            this.appConfig = config;
            if (config.apiKey === '' || config.apiKey === null) {
                this.router.navigate(['/settings']);
            } else {
                this.handleLanguageSettings(this.appConfig.languageMode);
            }
        });

        this.themeService.enableActiveTheme();
        this.registerKeyUpShortcut();
    }

    /**
     * Registers a keyboard key up shortcut to trigger translation after some delay
     */
    registerKeyUpShortcut(): void {
        this.keyUp
            .pipe(
                map((event: any) => event.target.value),
                debounceTime(250),
                distinctUntilChanged(),
                flatMap(search => of(search).pipe(delay(500))),
                catchError(err => throwError(err)),
                untilDestroyed(this)
            )
            .subscribe((text: string) => this.translate(text, this.appConfig.fromLang.key, this.appConfig.toLang.key));
    }

    /**
     * Sets listeners for events from electrons main process
     */
    setIpcListeners(): void {
        this.electronService.ipcRenderer.on('open-dictionary', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/dictionary']);
            });
        });

        // translate content from clipboard
        this.electronService.ipcRenderer.on('translate-clipboard', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/home']);
                const clipboardText = this.electronService.clipboard.readText();
                this.enteredText = clipboardText;
                this.translate(this.enteredText, this.appConfig.fromLang.key, this.appConfig.toLang.key);
            });
        });

        // clear translate area
        this.electronService.ipcRenderer.on('translate', () => {
            this.ngZone.run(() => {
                this.router.navigate(['/home']);
                this.enteredText = '';
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
     * Changes translation direction
     */
    changeTranslationDir(): void {
        this.onLanguageChange('fromLang', this.appConfig.toLang);
        this.onLanguageChange('toLang', this.appConfig.fromLang);
    }

    /**
     * Updates option value in the local storage
     * @param langDirection name of the translation direction (toLang or fromLang)
     * @param value option value
     */
    onLanguageChange(langDirection: string, value: Language): void {
        this.store.dispatch(updateConfig({ config: { [langDirection]: value } }));
        this.translate(this.enteredText, this.appConfig.fromLang.key, this.appConfig.toLang.key);
    }

    /**
     * Translate text
     * @param word string to translate
     */
    translate(word: string, fromLang: string, toLang: string): void {
        const temp = word.replace(/\n/g, ' '); // check for new line characters
        if (!/^ *$/.test(temp)) {
            if (fromLang === 'ad') {
                this.translateService
                    .detectLanguage(word, fromLang)
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
                if (this.appConfig.fromLang.key !== 'ad') {
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
                        this.isFavorited = false;
                    });
            }
        } else {
            this.translation = null;
        }
    }

    /**
     * Save entry to the dictionary
     */
    saveToDictionary(): void {
        this.vocabulary = this.storageService.getVocabulary();

        const dictItem = new DictionaryItem(
            this.enteredText,
            this.translation.$text,
            this.appConfig.fromLang,
            this.appConfig.toLang
        );
        this.vocabulary.push(dictItem);
        this.isFavorited = true;
        this.storageService.updateVocabulary(this.vocabulary);
        this.storageService.dictionaryChange.next('updated');
    }

    /**
     * Handles language options based on application settings
     * @param languageMode selected language mode
     */
    handleLanguageSettings(languageMode: LanguageMode): void {
        if (languageMode === 'preferred-languages') {
            this.setLanguages(this.appConfig.preferredLanguages);
        } else {
            this.requestLanguageList();
        }
    }

    /**
     * Get list with all available languages from the API
     */
    requestLanguageList(): void {
        this.translateService
            .getLanguagesList()
            .pipe(
                untilDestroyed(this),
                catchError(err => throwError(err))
            )
            .subscribe(response => this.setLanguages(response));
    }

    /**
     * Sets languages
     * @param languageList array with languages
     */
    setLanguages(languageList: Language[]): void {
        this.languageListFrom = [...languageList];
        this.languageListTo = [...languageList];
        this.languageListFrom.unshift(new Language('ad', 'Auto-detect'));
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
     */
    showDictionary(): void {
        if (this.electronService.remote) {
            this.electronService.ipcRenderer.send('openDictionary');
            this.hideMenu();
        } else {
            this.router.navigate(['dictionary']);
        }
    }

    /**
     * Closes the application
     */
    closeApp(): void {
        this.electronService.remote.app.quit();
    }

    /**
     * Closes more menu
     */
    hideMenu(): void {
        this.showMoreMenu = false;
    }
}
