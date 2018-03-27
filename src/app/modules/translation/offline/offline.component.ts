import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    providers: [],
    templateUrl: './offline.component.html'
})

export class OfflineComponent {
    /**
     * Creates an instance of OfflineComponent.
     * @param {Router} router angular router
     * @memberof OfflineComponent
     */
    constructor(private router: Router) {
        console.log('Offline mode');
    }
}
