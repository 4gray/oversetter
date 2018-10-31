import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@services/translate.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class ApiGuardService {

    /**
     * Creates an instance of ApiGuardService.
     * @param {TranslateService} translateService translate service
     * @param {Router} router angulars router
     * @memberof ApiGuardService
     */
    constructor(
        private translateService: TranslateService,
        private router: Router) { }

    /**
     * Checks api key
     *
     * @returns
     * @memberof ApiGuardService
     */
    canActivate() {
        return this.validateApiKey()
            .map(() => true)
            .catch(() => {
                this.router.navigate(['/settings']);
                return of(false);
            });
    }

    /**
     * Use getLangs API method to validate API key
     *
     * @returns {Observable<any>} observable response
     * @memberof ApiGuardService
     */
    public validateApiKey(): Observable<any> {
        return this.translateService.getLanguagesList();
    }
}
