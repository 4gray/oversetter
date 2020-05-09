import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '@app/models/language';

export type LanguageMode = 'all-languages' | 'preferred-languages';

/**
 * Language settings component
 */
@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent {
    /** Array with all available languages */
    @Input() languageList = [];
    /** Language mode (show all or only selected languages) */
    @Input() languageMode: LanguageMode = 'all-languages';
    /** Array with selected languages */
    @Input() preferredLangList = [];

    /** Emits if language was added to one of the lists */
    @Output() languageAdded: EventEmitter<Language[]> = new EventEmitter();
    /** Emits if language mode was changed */
    @Output() languageModeChanged: EventEmitter<LanguageMode> = new EventEmitter();
    /** Emits if language was removed from one of the lists */
    @Output() languageRemoved: EventEmitter<Language[]> = new EventEmitter();

    /** Selected languages to remove */
    languagesToRemove = [];
    /** Selected languages to add */
    selectedLanguages = [];
}
