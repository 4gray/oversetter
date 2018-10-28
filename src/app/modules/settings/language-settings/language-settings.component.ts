
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@services/translate.service';
import { Language } from '@app/models/language';

@Component({
    selector: 'app-language-settings',
    providers: [TranslateService],
    templateUrl: 'language-settings.component.html',
    styleUrls: ['language-settings.component.scss']
})

export class LanguageSettingsComponent implements OnInit {

    @Input() languages: string;
    @Input() languagesList: Language[];
    @Input() preferedLangList: Language[] = [];
    @Output() changeLanguageSettings = new EventEmitter<any>();

    selectedLanguage: Language;
    langToRemove: Language;

    constructor() { }

    ngOnInit() {
        console.log(this.languages);
    }

    /**
     * Add one or multiple language(-s) to the prefered language list
     * @param language string or array with language list as strings
     */
    public addLanguage(language: Language) {
        if (!language) { return; }

        if (language instanceof Array) {
            for (let i = 0; i < language.length; i++) {
                if (this.preferedLangList.filter(item => item.$value === language[i].value).length === 0) {
                    this.preferedLangList.push(language[i]);
                }
            }
        } else {
            if (this.preferedLangList.filter(item => item.$value === language[0].value).length === 0) {
                this.preferedLangList.push(language[0]);
            }
        }

        this.updateLanguageSettings();
    }

    /**
     * Remove one or multiple selected language(-s) from prefered language list
     * @param language selected one or multiple languages (array or string)
     */
    public removeLanguage(language: Language) {
        if (!language) { return; }

        let index;

        if (language instanceof Array) {
            for (let i = 0; i < language.length; i++) {
                index = this.preferedLangList.indexOf(language[i]);
                if (index > -1) {
                    this.preferedLangList.splice(index, 1);
                }
            }
        } else {
            index = this.preferedLangList.indexOf(language[0]);
            if (index > -1) {
                this.preferedLangList.splice(index, 1);
            }
        }

        this.updateLanguageSettings();

    }

    /**
     * Get language state (show all languages or only selected set)
     *
     * @private
     * @returns boolean value
     * @memberof SettingsComponent
     */
    public languageState() {
        if (this.languages === 'all-languages') {
            return true;
        } else {
            return false;
        }
    }


    updateLanguageSettings() {
        localStorage.setItem('preferedLanguageList', JSON.stringify(this.preferedLangList));
        this.changeLanguageSettings.emit(this.languages);
    }

}
