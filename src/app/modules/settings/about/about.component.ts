import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

/**
 * About component
 *
 * @export
 * @class AboutComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {


    /**
     * Version of the application
     *
     * @type {string}
     * @memberof AboutComponent
     */
    public version: string;


    constructor(private electronService: ElectronService) { }

    /**
     * Get version of the application
     *
     * @memberof AboutComponent
     */
    ngOnInit() {
        if (this.electronService.remote) {
            const window = this.electronService.remote.getCurrentWindow();
            this.version = window['version'];
        }
    }

    /**
     * Opens the given URL in external browser
     *
     * @param {string} url
     * @memberof SettingsComponent
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }

}
