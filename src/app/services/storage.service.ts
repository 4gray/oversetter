import { Injectable, EventEmitter } from '@angular/core';
import { Language } from '@app/models/language';
import { DictionaryItem } from '@app/models/dictionary-item';
import { Subject, Observable } from 'rxjs';
import { Settings } from '@app/models/settings';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    SETTINGS = 'oversetter.settings';
    VOCABULARY = 'oversetter.vocabulary';

    /**
     * Returns saved settings from the localstorage or defaults
     *
     * @returns {Settings} settings object
     * @memberof StorageService
     */
    getSettings(): Settings {
        const data = localStorage.getItem(this.SETTINGS);
        let settings;

        if (data !== null && data !== undefined) {
            settings = JSON.parse(data) as Settings;
            settings.preferedLanguageList = settings.preferedLanguageList.map(item => new Language(item.key, item.value));

            settings.fromLang = new Language(settings.fromLang.key, settings.fromLang.value);
            settings.toLang = new Language(settings.toLang.key, settings.toLang.value);

            return settings;
        } else {
            settings = new Settings();
            this.saveSettings(settings);

            return settings;
        }
    }

    /**
     * Updates settings in the localstorage
     *
     * @param {Settings} settings settings object
     * @memberof StorageService
     */
    saveSettings(settings: Settings) {
        localStorage.setItem(this.SETTINGS, JSON.stringify(settings));
    }

    /**
     * Returns vocabulary from local storage
     *
     * @returns {DictionaryItem[]}
     * @memberof StorageService
     */
    getVocabulary(): DictionaryItem[] {
        let vocabulary = JSON.parse(localStorage.getItem(this.VOCABULARY)) || [];
        if (vocabulary.length > 0) {
            vocabulary = vocabulary.map(item => {
                const dictItem: DictionaryItem = {
                    text: item.text,
                    translation: item.translation,
                    fromLang: item.fromLang,
                    toLang: item.toLang
                };
                return dictItem;
            });
        }
        return vocabulary;
    }

    /**
     * Updates local storage value with vocabulary list
     *
     * @param {DictionaryItem[]} vocabulary
     * @memberof StorageService
     */
    updateVocabulary(vocabulary: DictionaryItem[]): void {
        localStorage.setItem(this.VOCABULARY, JSON.stringify(vocabulary));
    }

}
