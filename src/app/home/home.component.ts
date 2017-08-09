import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
	selector: 'my-app',
	templateUrl: 'home.component.html'
})

// Component class
export class HomeComponent {
	public showArrow: Boolean;

	constructor(private electronService: ElectronService) {
		if (this.electronService.process.platform !== 'darwin') {
			this.showArrow = false;
		}
		else {
			this.showArrow = true;
		}
	}
}