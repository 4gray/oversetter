import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-root',
    styles: ['./about.component.scss'],
    templateUrl: './about.component.html'
})

export class AboutComponent {
    /**
     * Version of the application
     *
     * @type {string}
     * @memberof AboutComponent
     */
    public version: string;

    /**
     * Creates an instance of AboutComponent.
     * @param {ElectronService} electronService electron service
     * @memberof AboutComponent
     */
    constructor(private electronService: ElectronService) {
        const window = this.electronService.remote.getCurrentWindow();
        // tslint:disable-next-line:no-string-literal
        this.version = window['version'];
    }
}
