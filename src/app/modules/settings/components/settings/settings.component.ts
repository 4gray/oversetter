import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '@app/models/language';
import { AppSettings } from '@models/appsettings';
import { TranslateService } from '@services/translate.service';
import { ElectronService } from 'ngx-electron';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { LanguageMode } from '../languages/languages.component';

@Component({
    providers: [TranslateService],
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
    apiKey: string;
    errorMessage = '';

    settings = {
        autolaunch: false,
        alwaysOnTop: false,
        showDockIcon: false,
    };

    langList = [];
    preferredLangList = [];
    languageMode: LanguageMode = 'all-languages';
    tabs = [
        {
            id: 'api',
            title: 'API',
        },
        {
            id: 'general',
            title: 'General',
        },
        {
            id: 'languages',
            title: 'Languages',
        },
        {
            id: 'about',
            title: 'About',
        },
    ];
    public selectedTabId = 'api';

    /**
     * Version of the application
     *
     * @type {string}
     */
    public version: string;

    /**
     * Constructor function - set API key from the localstorage
     * @param translateService translation service object
     * @param router router object
     */
    constructor(
        private translateService: TranslateService,
        private router: Router,
        private electronService: ElectronService,
        route: ActivatedRoute
    ) {
        route.queryParams.pipe(untilDestroyed(this)).subscribe(param => {
            const tabName = param['tab'] || '';
            if (tabName === 'about') {
                this.selectedTabId = 'about';
            }
        });

        this.setSettings();

        this.apiKey = AppSettings.$apiKey;
        this.langList = AppSettings.$languageList;

        if (this.electronService.remote) {
            const window = this.electronService.remote.getCurrentWindow();
            this.version = window['version'];
        }
    }

    /**
     * Get settings from local storage and set them on application level
     */
    setSettings(): void {
        if (localStorage.getItem('autolaunch')) {
            this.settings.autolaunch = localStorage.getItem('autolaunch') === 'true';
        }

        if (localStorage.getItem('alwaysOnTop')) {
            this.settings.alwaysOnTop = localStorage.getItem('alwaysOnTop') === 'true';
        }

        if (localStorage.getItem('showDockIcon')) {
            this.settings.showDockIcon = localStorage.getItem('showDockIcon') === 'true';
        }

        if (localStorage.getItem('languageMode')) {
            this.languageMode = localStorage.getItem('languageMode') as LanguageMode;
            this.preferredLangList = JSON.parse(localStorage.getItem('preferredLanguageList')) || [];
            this.preferredLangList.forEach(item => new Language(item.key, item.value));
        } else {
            // set default language
            this.preferredLangList.push(new Language('en', 'English'));
        }
    }

    /**
     * Save Yandex Translate API key to the local Nfstorage
     * @param value option value ('apiKey')
     * @param option name of the option
     */
    saveSettings(value: string, option: string): void {
        localStorage.setItem(option, value);
        AppSettings.$apiKey = value;
        this.validateApiKey();
        this.setAutoLaunch(); // TODO: combine to one IPC-Renderer-request
        this.setAlwaysOnTop();
        this.setShowDockIcon();
        this.setPreferredLanguageList();
    }

    /**
     * Use getLangs API method to validate API key
     */
    validateApiKey(): void {
        this.translateService
            .getLanguagesList()
            .pipe(untilDestroyed(this))
            .subscribe(
                () => this.router.navigate(['/home']),
                error => (this.errorMessage = error)
            );
    }

    /**
     * Close application
     */
    closeApp(): void {
        this.electronService.remote.app.quit();
    }

    /**
     * Save list with preferred languages
     */
    private setPreferredLanguageList(): void {
        localStorage.setItem('languageMode', String(this.languageMode));
        localStorage.setItem('preferredLanguageList', JSON.stringify(this.preferredLangList));
    }

    /**
     * Save always as top option
     */
    private setAlwaysOnTop(): void {
        localStorage.setItem('alwaysOnTop', String(this.settings.alwaysOnTop));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('alwaysOnTop', this.settings.alwaysOnTop); // TODO: implement in the main process
        }
    }

    /**
     * Save show dock icon option
     */
    private setShowDockIcon(): void {
        localStorage.setItem('showDockIcon', String(this.settings.showDockIcon));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('showDockIcon', this.settings.showDockIcon); // TODO: implement in the main process
        }
    }

    /**
     * Save auto launch options
     */
    private setAutoLaunch(): void {
        localStorage.setItem('autolaunch', String(this.settings.autolaunch));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('autolaunch', this.settings.autolaunch);
        }
    }

    /**
     * Opens the given URL in external browser
     *
     * @param {string} url
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

    /**
     * Sets the given tab as selected
     *
     * @param {string} tabId tab id
     */
    selectTab(tabId: string): void {
        this.selectedTabId = tabId;
    }

    /**
     * Add one or multiple language(-s) to the preferred language list
     * @param language string or array with language list as strings
     */
    addLanguage(language): void {
        if (!language) {
            return;
        }

        if (language instanceof Array) {
            for (let i = 0; i < language.length; i++) {
                if (this.preferredLangList.filter(item => item.value === language[i].value).length === 0) {
                    this.preferredLangList.push(language[i]);
                }
            }
        } else {
            if (this.preferredLangList.filter(item => item.value === language[0].value).length === 0) {
                this.preferredLangList.push(language[0]);
            }
        }
    }

    /**
     * Remove one or multiple selected language(-s) from preferred language list
     * @param language selected one or multiple languages (array or string)
     */
    removeLanguage(language: any): void {
        let index;

        if (language instanceof Array) {
            for (let i = 0; i < language.length; i++) {
                index = this.preferredLangList.indexOf(language[i]);
                if (index > -1) {
                    this.preferredLangList.splice(index, 1);
                }
            }
        } else {
            index = this.preferredLangList.indexOf(language[0]);
            if (index > -1) {
                this.preferredLangList.splice(index, 1);
            }
        }
    }

    /**
     * Sets provided API key
     * @param apiKey API key
     */
    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    /**
     * Sets language mode
     * @param languageMode selected language mode
     */
    setLanguageMode(languageMode: LanguageMode): void {
        this.languageMode = languageMode;
    }

    ngOnDestroy(): void {}
}
