import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
	selector: 'my-app',
	templateUrl: 'about.component.html'
})

export class AboutComponent {
	public version: string;

	constructor(private electronService: ElectronService) {
		let window = this.electronService.remote.getCurrentWindow();
		this.version = window['version'];
	}
}