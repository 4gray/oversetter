import { Injectable } from '@angular/core';
import { Language } from '@app/models/language';
import { DictionaryItem } from '@app/models/dictionary-item';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /**
     * Returns origin language from the local storage
     *
     * @returns {Language}
     * @memberof StorageService
     */
    getFromLanguage(): Language {
        const fromLang = JSON.parse(localStorage.getItem('fromLang'));
        if (fromLang) {
            return new Language(fromLang.key, fromLang.value);
        } else {
            return new Language('ad', 'Auto-detect');
        }
    }

    /**
     * Returns target language from the local storage
     *
     * @returns {Language}
     * @memberof StorageService
     */
    getToLanguage(): Language {
        const toLang = JSON.parse(localStorage.getItem('toLang'));
        if (toLang) {
            return new Language(toLang.key, toLang.value);
        } else {
            return new Language('en', 'English');
        }
    }

    /**
     * Returns vocabulary from local storage
     *
     * @returns {DictionaryItem[]}
     * @memberof StorageService
     */
    getVocabulary(): DictionaryItem[] {
        let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
        if (vocabulary.length > 0) {
            vocabulary = vocabulary.map(item => {
                return new DictionaryItem(item.text, item.translation, item.fromLang, item.toLang);
            });
        }
        return vocabulary;
    }

    /**
     * Updates local storage value with vocabulary list
     *
     * @param {*} vocabulary
     * @memberof StorageService
     */
    updateVocabulary(vocabulary) {
        localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    }

}
