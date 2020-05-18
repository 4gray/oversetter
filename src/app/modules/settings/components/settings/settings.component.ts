import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '@app/models/language';
import { ThemeService } from '@app/services/theme.service';
import * as ConfigActions from '@app/store/actions/config.actions';
import * as fromConfig from '@app/store/reducers';
import { ConfigState } from '@app/store/reducers/config.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@services/translate.service';
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs';
import { LanguageMode } from '../languages/languages.component';

/** Tab definition */
interface Tab {
    id: TabId;
    title: string;
}

type TabId = 'api' | 'general' | 'languages' | 'about';

/** Default Yandex Translate API key */
const DEFAULT_API_KEY = 'trnsl.1.1.20160306T121040Z.ce3153278463656c.38be842aceb435f1c023544f5571eb64e2c01fdf';

@UntilDestroy()
@Component({
    providers: [TranslateService],
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss'],
})
export class SettingsComponent {
    /** Api key */
    apiKey: string;

    /** Error message */
    errorMessage = '';

    /** Applications default settings */
    settings: ConfigState;

    /** Array with all languages */
    langList$: Observable<Language[]>;

    /** Array with preferred languages, selected from the settings */
    preferredLangList = [];

    /** Pre-selected language mode */
    languageMode: LanguageMode = 'all-languages';

    /** Settings tabs */
    tabs: Tab[] = [
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
    selectedTabId: TabId = 'api';

    /** Version of the application */
    version: string;

    /**
     * Constructor function - set API key from the local storage
     * @param translateService translation service object
     * @param router router object
     * @param electronService electrons main process wrapper
     * @param route angulars activated route module
     * @param store ngrx store
     * @param themeService applications theme service
     */
    constructor(
        private translateService: TranslateService,
        private router: Router,
        private electronService: ElectronService,
        route: ActivatedRoute,
        private store: Store,
        private themeService: ThemeService
    ) {
        route.queryParams.pipe(untilDestroyed(this)).subscribe(param => {
            const tabName = param.tab || 'api';
            if (tabName && tabName !== '') {
                this.selectedTabId = tabName;
            }
        });

        this.store.pipe(select(fromConfig.getConfig), untilDestroyed(this)).subscribe(config => {
            this.settings = config;
            this.apiKey = config.apiKey;
        });

        // TODO: cache
        this.langList$ = this.translateService.getLanguagesList();

        if (this.electronService.remote) {
            const window = this.electronService.remote.getCurrentWindow();
            this.version = window['version'];
        }
    }

    /**
     * Update changed setting option
     * @param updatedOption updated settings option
     */
    updateSettings(updatedOption: Partial<ConfigState>): void {
        this.settings = {
            ...this.settings,
            ...updatedOption,
        };
        if (updatedOption.theme) {
            // activate selected theme for preview
            this.themeService.setThemeById(updatedOption.theme);
        }
    }

    /**
     * Sends application settings toi the application store
     * @param apiKey yandex translate api key
     */
    saveSettings(apiKey: string): void {
        this.store.dispatch(
            ConfigActions.updateConfig({
                config: {
                    ...this.settings,
                },
            })
        );
        // electron settings
        this.setGeneralSettings();
        this.validateApiKey(apiKey);
    }

    /**
     * Use getLangs API method to validate API key
     * // TODO: separate endpoint for KEY validation with direct key input
     */
    validateApiKey(apiKey: string): void {
        this.store.dispatch(ConfigActions.updateConfig({ config: { apiKey } }));
        this.translateService
            .getLanguagesList()
            .pipe(untilDestroyed(this))
            .subscribe(
                () => {
                    this.router.navigate(['/home']);
                },
                error => (this.errorMessage = error)
            );
    }

    /**
     * Closes the application
     */
    closeApp(): void {
        this.electronService.remote.app.quit();
    }

    /**
     * Sets general application settings (electron level)
     */
    setGeneralSettings(): void {
        this.store.dispatch(ConfigActions.updateConfig({ config: this.settings }));
        if (this.electronService.ipcRenderer) {
            this.electronService.ipcRenderer.send('settings-update', this.settings);
        }
    }

    /**
     * Opens the given URL in external browser
     *
     * @param url url to open
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

    /**
     * Sets the given tab as selected
     *
     * @param tabId tab id
     */
    selectTab(tabId: TabId): void {
        this.router.navigate(['/settings'], { queryParams: { tab: tabId } });
    }

    /**
     * Sets provided API key
     * @param apiKey API key
     */
    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }
}
