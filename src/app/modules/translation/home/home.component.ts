import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Home component with router-outlet
 *
 * @export
 * @class HomeComponent
 */
@Component({
    selector: 'app-root',
    templateUrl: 'home.component.html'
})

export class HomeComponent {
    /**
     * Creates an instance of HomeComponent. Register offline listener
     * @param {Router} router angulars router module
     * @memberof HomeComponent
     */
    constructor(private router: Router) {
        window.addEventListener('offline', () => this.router.navigate(['/offline']));
        window.addEventListener('online', () => this.router.navigate(['/home']));
    }
}
