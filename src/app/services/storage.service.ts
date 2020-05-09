import { Injectable } from '@angular/core';
import { DictionaryItem } from '@app/models/dictionary-item';
import { Language } from '@app/models/language';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    /** Emits changes in the dictionary to the parent component */
    dictionaryChange: Subject<string> = new Subject<string>();

    /**
     * Returns origin language from the local storage
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
     */
    updateVocabulary(vocabulary): void {
        localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    }
}
