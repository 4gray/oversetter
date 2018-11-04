import { Injectable, OnInit } from '@angular/core';
import { Settings } from '@app/models/settings';
import { StorageService } from './storage.service';
import { Language } from '@app/models/language';

@Injectable({
    providedIn: 'root'
})
export class SettingsService implements OnInit {

    /**
     * Settings object
     *
     * @type {Settings}
     * @memberof SettingsService
     */
    settings: Settings;

    /**
     * Creates an instance of SettingsService.
     * @param {StorageService} storageService storage service
     * @memberof SettingsService
     */
    constructor(private storageService: StorageService) {
        this.settings = this.storageService.getSettings();
    }

    ngOnInit(): void { }

    /**
     * Returns settings object
     *
     * @returns {Settings} settings object
     * @memberof SettingsService
     */
    getSettings(): Settings {
        return this.settings;
    }

    /**
     * Sets updated settings object
     *
     * @param {Settings} settings
     * @memberof SettingsService
     */
    setSettings(settings: Settings): void {
        this.settings = settings;

        // update settings in localstorage
        this.saveSettings();
    }

    /**
     * Saves settings to the localstorage
     *
     * @memberof SettingsService
     */
    saveSettings() {
        this.storageService.saveSettings(this.settings);
    }

    /**
     * Sets "from" or "to" language
     *
     * @param {string} langDirection translation direction
     * @param {Language} language selected language object
     * @memberof SettingsService
     */
    setLanguage(langDirection: string, language: Language) {
        if (langDirection === 'fromLang') {
            this.settings.fromLang = language;
        } else {
            this.settings.toLang = language;
        }

        this.saveSettings();
    }

    /**
     * Returns "from" language
     *
     * @returns {Language} language object
     * @memberof SettingsService
     */
    getFromLang(): Language {
        return this.settings.fromLang;
    }

    /**
     * Returns "to" language
     *
     * @returns {Language} language object
     * @memberof SettingsService
     */
    getToLang(): Language {
        return this.settings.toLang;
    }

}
