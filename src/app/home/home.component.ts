import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
	selector: 'my-app',
	templateUrl: 'home.component.html'
})

export class HomeComponent {
	public showArrow: Boolean;

	constructor(private electronService: ElectronService) {
		const platform = this.electronService.process.platform;
		let window = this.electronService.remote.getCurrentWindow();
		if (platform !== 'darwin' || window['dialog'] === 'about') {
			this.showArrow = false;
		}
		else {
			this.showArrow = true;
		}
	}
}