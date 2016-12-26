import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

@Component({
	selector: 'my-app',
	template: `<div class="arrow-up"></div>
				<div class="container">
					<router-outlet></router-outlet>
				</div>`
})

// Component class
export class HomeComponent {}