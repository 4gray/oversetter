import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '@app/models/language';
import { ThemeService } from '@app/services/theme.service';
import { AppSettings } from '@models/appsettings';
import { untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@services/translate.service';
import { ElectronService } from 'ngx-electron';
import { LanguageMode } from '../languages/languages.component';

/** Default Yandex Translate API key */
const DEFAULT_API_KEY = 'trnsl.1.1.20160306T121040Z.ce3153278463656c.38be842aceb435f1c023544f5571eb64e2c01fdf';

@Component({
    providers: [TranslateService],
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
    /** Api key */
    apiKey: string;

    /** Error message */
    errorMessage = '';

    /** Applications default settings */
    settings = {
        autolaunch: false,
        alwaysOnTop: false,
        showDockIcon: false,
        theme: 'light',
    };

    /** Array with all languages */
    langList = [];

    /** Array with preferred languages, selected from the settings */
    preferredLangList = [];

    /** Pre-selected language mode */
    languageMode: LanguageMode = 'all-languages';

    /** Settings tabs */
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

    /** Pre-selected settings tab */
    selectedTabId = 'api';

    /** Version of the application */
    version: string;

    /**
     * Constructor function - set API key from the local storage
     * @param translateService translation service object
     * @param router router object
     * @param electronService electrons main process wrapper
     * @param route angulars activated route module
     */
    constructor(
        private translateService: TranslateService,
        private router: Router,
        private electronService: ElectronService,
        route: ActivatedRoute,
        private themeService: ThemeService
    ) {
        route.queryParams.pipe(untilDestroyed(this)).subscribe(param => {
            const tabName = param.tab || 'api';
            if (tabName && tabName !== '') {
                this.selectedTabId = tabName;
            }
        });

        this.setSettings();
        this.setApiKey(AppSettings.$apiKey || DEFAULT_API_KEY);
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

        if (localStorage.getItem('theme')) {
            this.settings.theme = localStorage.getItem('theme');
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
     * Save Yandex Translate API key to the local storage
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
        this.setTheme();
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
     * Save theme settings
     */
    private setTheme(): void {
        localStorage.setItem('theme', this.settings.theme);
        this.themeService.setActiveTheme(this.settings.theme);
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
     * @param languages string or array with language list as strings
     */
    addLanguage(languages: Language[]): void {
        if (languages.length > 0) {
            for (let i = 0; i < languages.length; i++) {
                if (this.preferredLangList.filter(item => item.value === languages[i].$value).length === 0) {
                    this.preferredLangList.push(languages[i]);
                }
            }
        }
    }

    /**
     * Remove one or multiple selected language(-s) from preferred language list
     * @param languages selected one or multiple languages (array or string)
     */
    removeLanguage(languages: Language[]): void {
        let index;

        if (languages.length > 0) {
            for (let i = 0; i < languages.length; i++) {
                index = this.preferredLangList.indexOf(languages[i]);
                if (index > -1) {
                    this.preferredLangList.splice(index, 1);
                }
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

    /** Required for unsubscribe mechanism */
    ngOnDestroy(): void {}
}
