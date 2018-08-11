import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'home.component.html'
})

export class HomeComponent {
    constructor(private router: Router) {
        window.addEventListener('offline', () => this.router.navigate(['/offline']));
        window.addEventListener('online', () => this.router.navigate(['/home']));
    }
}
