import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { AppSettings } from '@models/appsettings';
import { TranslateService } from '@services/translate.service';
import { Language } from '@app/models/language';
import { Observable } from 'rxjs';

@Component({
    providers: [TranslateService],
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})

export class SettingsComponent {
    public apiKey: string;
    public errorMessage = '';
    public autolaunch = false;
    public alwaysOnTop = false;
    public showDockIcon = false;
    public languagesList: Observable<Language[]>;
    public preferedLangList: Observable<Language[]>;
    public languages = localStorage.getItem('languages') || 'all-languages';
    // public selectedLang;
    // public langToRemove;
    public tabs = [
        {
            id: 'api',
            title: 'API'
        },
        {
            id: 'general',
            title: 'General'
        },
        {
            id: 'languages',
            title: 'Languages'
        },
        {
            id: 'about',
            title: 'About'
        }
    ];
    public selectedTabId = 'api';
    /* public showArrow = false; */

    /**
     * Constructor function - set API key from the localstorage
     * @param translateService translation service object
     * @param router router object
     */
    constructor(private translateService: TranslateService,
        private router: Router,
        private electronService: ElectronService,
        route: ActivatedRoute) {

        route.queryParams.subscribe(param => {
            const tabName = param['tab'] || '';
            if (tabName === 'about') {
                this.selectedTabId = 'about';
            }
        });

        this.apiKey = AppSettings.$apiKey;
        if (localStorage.getItem('autolaunch')) {
            this.autolaunch = (localStorage.getItem('autolaunch') === 'true');
        }

        if (localStorage.getItem('alwaysOnTop')) {
            this.alwaysOnTop = (localStorage.getItem('alwaysOnTop') === 'true');
        }

        if (localStorage.getItem('showDockIcon')) {
            this.showDockIcon = (localStorage.getItem('showDockIcon') === 'true');
        }

        if (localStorage.getItem('languages')) {
            this.showDockIcon = (localStorage.getItem('languages') === 'true');
            /* const preferedLangs = JSON.parse(localStorage.getItem('preferedLanguageList')) || [new Language('en', 'English')]; */
            this.preferedLangList = this.translateService.getLanguagesList(false, 'select-languages');
        }

        this.languagesList = this.translateService.getLanguagesList();
        /* this.showArrow = this.uiService.showArrow; */

    }

    /**
     * Save Yandex Translate API key to the localstorage
     * @param value option value ('apiKey')
     * @param option name of the option
     */
    public saveApiKey(value: string, option: string) {
        localStorage.setItem(option, value);
        AppSettings.$apiKey = value;
        this.validateApiKey();
        this.setAutoLaunch(); // TODO: combine to one IPCrenderer-request
        this.setAlwaysOnTop();
        this.setShowDockIcon();
        this.setPreferedLanguageList();
    }

    /**
     * Use getLangs API method to validate API key
     */
    public validateApiKey() {
        const l$ = this.translateService.getLanguagesList();
        l$.subscribe(
            response => {
                this.router.navigate(['/home']);
                // let myNotification = new Notification('Oversetter', {
                // 	body: 'Settings were saved'
                // });
            },
            err => this.errorMessage = err
        );
    }

    /**
     * Close application
     */
    public closeApp() {
        this.electronService.remote.app.quit();
    }

    /**
     * Save list with prefered languages
     */
    private setPreferedLanguageList() {
        localStorage.setItem('languages', String(this.languages));
    }

    /**
     * Save always as top option
     */
    private setAlwaysOnTop() {
        localStorage.setItem('alwaysOnTop', String(this.alwaysOnTop));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('alwaysOnTop', this.alwaysOnTop); // TODO: implement in the main process
        }
    }

    /**
     * Save show dock icon option
     */
    private setShowDockIcon() {
        localStorage.setItem('showDockIcon', String(this.showDockIcon));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('showDockIcon', this.showDockIcon); // TODO: implement in the main process
        }
    }

    /**
     * Save auto launch options
     */
    private setAutoLaunch() {
        localStorage.setItem('autolaunch', String(this.autolaunch));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('autolaunch', this.autolaunch);
        }
    }

    /**
     * Opens the given URL in external browser
     *
     * @param {string} url
     * @memberof SettingsComponent
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

    /**
     * Sets the given tab as selected
     *
     * @param {string} tabId tab id
     * @memberof SettingsComponent
     */
    selectTab(tabId: string) {
        this.selectedTabId = tabId;
    }

    updateLanguageSettings(languageSettings: string) {
        this.languages = languageSettings;
    }


}
