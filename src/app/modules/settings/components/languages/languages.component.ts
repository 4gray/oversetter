import { Component, EventEmitter, Input, Output } from '@angular/core';

export type LanguageMode = 'all-languages' | 'preferred-languages';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent {
    /** Array with all available languages */
    @Input() languageList = [];
    /** Language mode (show all or only selected languages) */
    @Input() languageMode: LanguageMode = 'all-languages';
    /** Array with selected languages */
    @Input() preferredLangList = [];

    /** Emits if language was added to one of the lists */
    @Output() languageAdded: EventEmitter<any> = new EventEmitter();
    /** Emits if language mode was changed */
    @Output() languageModeChanged: EventEmitter<LanguageMode> = new EventEmitter();
    /** Emits if language was removed from one of the lists */
    @Output() languageRemoved: EventEmitter<any> = new EventEmitter();

    languageToRemove;
    selectedLanguage;

    /**
     * Get language state (show all languages or only selected set)
     *
     * @returns boolean value
     */
    languageState(): boolean {
        return this.languageMode === 'all-languages';
    }
}
