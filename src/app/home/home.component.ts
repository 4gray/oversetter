import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';

@Component({
	selector: 'my-app',
	templateUrl: 'home.component.html'
})

export class HomeComponent {
	public showArrow: Boolean;

	constructor(private electronService: ElectronService, private router: Router) {
		const platform = this.electronService.process.platform;
		let browserWindow = this.electronService.remote.getCurrentWindow();
		if (platform !== 'darwin' || browserWindow['dialog'] === 'about') {
			this.showArrow = false;
		}
		else {
			this.showArrow = true;
		}
		
		window.addEventListener('offline', () => this.router.navigate(['/offline']));
		window.addEventListener('online',  () => this.router.navigate(['/home']));
	}
}