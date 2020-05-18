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

    /** Emits if language settings were changed */
    @Output() optionChanged: EventEmitter<{
        languageMode: LanguageMode;
        preferredLanguages: Language[];
    }> = new EventEmitter();

    /** Compares language object to display selected only */
    compareLangs(lang1: Language, lang2: Language): any {
        return lang1 && lang2 ? lang1.key === lang2.key : lang1 === lang2;
    }
}
