import { Injectable, OnInit } from '@angular/core';
import { Settings } from '@app/models/settings';
import { StorageService } from './storage.service';
import { Language } from '@app/models/language';

@Injectable({
    providedIn: 'root'
})
export class SettingsService implements OnInit {

    settings: Settings;

    constructor(private storageService: StorageService) {
        this.settings = this.storageService.getSettings();
        console.log(this.settings);
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

    saveSettings() {
        this.storageService.saveSettings(this.settings);
    }

    setLanguage(langDirection: string, language: Language) {
        if (langDirection === 'fromLang') {
            this.settings.fromLang = language;
        } else {
            this.settings.toLang = language;
        }

        this.saveSettings();
    }

}
