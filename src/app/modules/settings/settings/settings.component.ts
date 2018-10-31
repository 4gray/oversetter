import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { TranslateService } from '@services/translate.service';
import { Language } from '@app/models/language';
import { Observable } from 'rxjs';
import { SettingsService } from '@app/services/settings.service';
import { Settings } from '@app/models/settings';
import { UiService } from '@app/services/ui.service';

/**
 * Settings component
 *
 * @export
 * @class SettingsComponent
 */
@Component({
    providers: [TranslateService],
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})

export class SettingsComponent implements OnInit {

    /**
     * Error message string
     *
     * @memberof SettingsComponent
     */
    public errorMessage = '';


    /**
     * List with all available languages
     *
     * @type {Observable<Language[]>}
     * @memberof SettingsComponent
     */
    public languagesList: Observable<Language[]>;


    /**
     * Settings tabs
     *
     * @memberof SettingsComponent
     */
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

    /**
     * Selected tab string
     *
     * @memberof SettingsComponent
     */
    public selectedTabId = 'api';

    settings: Settings;

    /**
     * Constructor function - set API key from the localstorage
     * @param translateService translation service object
     * @param electronService electron service
     * @param router router object
     */
    constructor(private translateService: TranslateService,
        private router: Router,
        private electronService: ElectronService,
        private settingsService: SettingsService,
        private uiService: UiService,
        route: ActivatedRoute) {

        route.queryParams.subscribe(param => {
            const tabName = param['tab'] || '';
            if (tabName === 'about') {
                this.selectedTabId = 'about';
            }
        });

        this.settings = this.settingsService.getSettings();

        // set settings -> TODO
        /* this.apiKey = this.settings.apiKey;
        this.autolaunch = this.settings.autolaunch;
        this.alwaysOnTop = this.settings.alwaysOnTop;
        this.showDockIcon = this.settings.showDockIcon;
        this.preferedLangList = this.settings.preferedLanguageList;
        this.languages = this.settings.languages; */

        // requests language list
        this.languagesList = this.translateService.getLanguagesList();
    }

    ngOnInit(): void { }

    /**
     * Updates settings
     *
     * @memberof SettingsComponent
     */
    public saveSettings(): void {
        this.settingsService.setSettings(this.settings);

        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('alwaysOnTop', this.settings.alwaysOnTop);
            this.electronService.ipcRenderer.send('showDockIcon', this.settings.showDockIcon);
            this.electronService.ipcRenderer.send('autolaunch', this.settings.autolaunch);
        }

        this.validateApiKey();
    }

    /**
     * Uses getLangs API method to validate API key
     */
    public validateApiKey(): void {
        this.translateService.getLanguagesList()
            .subscribe(
                () => this.router.navigate(['/home']),
                err => this.errorMessage = err
            );
    }

    /**
     * Sets the given tab as selected
     *
     * @param {string} tabId tab id
     * @memberof SettingsComponent
     */
    selectTab(tabId: string): void {
        this.selectedTabId = tabId;
    }

    /**
     * Closes application
     */
    public closeApp(): void {
        this.uiService.closeApp();
    }


    /**
     * Opens the given URL in external browser
     *
     * @param {string} url webiste url
     * @memberof SettingsComponent
     */
    openUrl(url: string): void {
        this.uiService.openUrl(url);
    }

    updateLanguageSettings(language: string) {
        this.settings.languages = language;
    }

}
