import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
    providedIn: 'root'
})
export class UiService {
    showArrow = false;

    constructor(private electronService: ElectronService) {

        // show arrow on the top of the window in mac os
        if (this.electronService.process) {
            const platform = this.electronService.process.platform;
            const browserWindow = this.electronService.remote.getCurrentWindow();

            if (platform !== 'darwin' || browserWindow['dialog'] === 'about' || browserWindow['dialog'] === 'dictionary') {
                this.showArrow = false;
            } else {
                this.showArrow = true;
            }

        }
    }

}
