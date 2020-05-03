import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ThemeService } from '@app/services/theme.service';

export interface IGeneralSettings {
    autolaunch: string;
    alwaysOnTop: string;
    showDockIcon: string;
    languages: string;
    theme: string;
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

    /** Get all available themes */
    availableThemes = this.themeService.getAvailableThemes();

    constructor(private themeService: ThemeService) {}

    toggleTheme(selected: string): void {
        this.themeService.setThemeById(selected);
    }
}
