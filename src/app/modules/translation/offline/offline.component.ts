import { Component } from '@angular/core';
import { Router } from '@angular/router';
/**
 * Offline view component
 *
 * @export
 * @class OfflineComponent
 */
@Component({
    providers: [],
    templateUrl: './offline.component.html',
    styleUrls: ['offline.component.scss']
})

export class OfflineComponent {
    /**
     * Creates an instance of OfflineComponent.
     * @param {Router} router angular router
     * @memberof OfflineComponent
     */
    constructor(private router: Router) {
        console.log('Offline mode enabled');
    }
}
