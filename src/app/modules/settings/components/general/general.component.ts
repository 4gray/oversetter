import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export interface IGeneralSettings {
    autolaunch: string;
    alwaysOnTop: string;
    showDockIcon: string;
    languages: string;
}

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent {
    /** General settings object */
    @Input() settings: IGeneralSettings;
}
