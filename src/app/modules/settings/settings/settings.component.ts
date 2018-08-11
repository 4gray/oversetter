import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { AppSettings } from '@models/appsettings';
import { TranslateService } from '@services/translate.service';
import { UiService } from '@app/services/ui.service';

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
    public langList = [];
    public preferedLangList = [];
    public languages = 'all-languages';
    public selectedLang;
    public langToRemove;
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
        }
    ];
    public selectedTabId = 'api';

    /**
     * Constructor function - set API key from the localstorage
     * @param translateService translation service object
     * @param router router object
     */
    // tslint:disable-next-line:max-line-length
    constructor(private translateService: TranslateService, private router: Router, private electronService: ElectronService, private uiService: UiService) {

        this.apiKey = AppSettings.$API_KEY;
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
        }

        if (localStorage.getItem('languages')) {
            this.languages = localStorage.getItem('languages');
            // console.log(JSON.parse(localStorage.getItem('preferedLanguageList')));
            this.preferedLangList = JSON.parse(localStorage.getItem('preferedLanguageList')) || [];
        } else {
            // set default
            this.preferedLangList.push({ 'key': 'en', 'value': 'English' });
        }

        this.langList = AppSettings.$LANGS;
    }

    /**
     * Save Yandex Translate API key to the localstorage
     * @param value option value ('apiKey')
     * @param option name of the option
     */
    public saveApiKey(value: string, option: string) {
        localStorage.setItem(option, value);
        AppSettings.$API_KEY = value;
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
     * Add one or multiple language(-s) to the prefered language list
     * @param language string or array with language list as strings
     */
    public addLanguage(language) {
        if (!language) { return; }

        if (language instanceof Array) {
            for (let i = 0; i < language.length; i++) {
                if (this.preferedLangList.filter(item => item.value === language[i].value).length === 0) {
                    this.preferedLangList.push(language[i]);
                }
            }
        } else {
            if (this.preferedLangList.filter(item => item.value === language[0].value).length === 0) {
                this.preferedLangList.push(language[0]);
            }
        }
    }

    /**
     * Remove one or multiple selected language(-s) from prefered language list
     * @param language selected one or multiple languages (array or string)
     */
    public removeLanguage(language) {

        let index;

        if (language instanceof Array) {
            for (let i = 0; i < language.length; i++) {
                index = this.preferedLangList.indexOf(language[i]);
                if (index > -1) {
                    this.preferedLangList.splice(index, 1);
                }
            }
        } else {
            index = this.preferedLangList.indexOf(language[0]);
            if (index > -1) {
                this.preferedLangList.splice(index, 1);
            }
        }
    }

    /**
     * Get language state (show all languages or only selected set)
     *
     * @private
     * @returns boolean value
     * @memberof SettingsComponent
     */
    public languageState() {
        if (this.languages === 'all-languages') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Save list with prefered languages
     */
    private setPreferedLanguageList() {
        localStorage.setItem('languages', String(this.languages));
        localStorage.setItem('preferedLanguageList', JSON.stringify(this.preferedLangList));
    }

    /**
     * Save always as top option
     */
    private setAlwaysOnTop() {
        localStorage.setItem('alwaysOnTop', String(this.alwaysOnTop));
        this.electronService.ipcRenderer.send('alwaysOnTop', this.alwaysOnTop); // TODO: implement in the main process
    }

    /**
     * Save show dock icon option
     */
    private setShowDockIcon() {
        localStorage.setItem('showDockIcon', String(this.showDockIcon));
        this.electronService.ipcRenderer.send('showDockIcon', this.showDockIcon); // TODO: implement in the main process
    }

    /**
     * Save auto launch options
     */
    private setAutoLaunch() {
        localStorage.setItem('autolaunch', String(this.autolaunch));
        this.electronService.ipcRenderer.send('autolaunch', this.autolaunch);
    }


    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

    selectTab(tabId) {
        this.selectedTabId = tabId;
    }

}
