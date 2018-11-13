import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from './translate.service';
import { Language } from '@app/models/language';
import { SettingsService } from './settings.service';


@Injectable()
export class LangResolver implements Resolve<Observable<Language[]>> {
    constructor(
        private translateService: TranslateService,
        private settingsService: SettingsService
    ) { }

    /**
     * Returns languages list as observable
     *
     * @returns {Observable<Language[]>} languages observable object
     * @memberof LangResolver
     */
    resolve(): Observable<Language[]> {
        const storeType = this.settingsService.getSettings().languages;

        if (storeType === 'select-languages') {
            return this.translateService.getPreferedLanguagesList();
        } else {
            return this.translateService.getLanguagesList();
        }
    }
}