import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ElectronService } from 'ngx-electron';

/**
 * API Settings component
 */
@Component({
    selector: 'app-api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.scss'],
})
export class ApiComponent {
    /** Yandex API key */
    @Input() apiKey: string;

    /** Emits on key change */
    @Output() keyChanged: EventEmitter<string> = new EventEmitter();

    /**
     * Creates an instance of ApiComponent
     * @param electronService electron service
     */
    constructor(private electronService: ElectronService) {}

    /**
     * Opens the given URL in external browser
     *
     * @param url url to open
     */
    openUrl(url: string): void {
        this.electronService.shell.openExternal(url);
    }
}
