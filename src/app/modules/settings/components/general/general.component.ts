import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ThemeService } from '@app/services/theme.service';

/** Settings interface */
export interface IGeneralSettings {
    autolaunch: string;
    alwaysOnTop: string;
    showDockIcon: string;
    languages: string;
    theme: string;
}

/**
 * General settings component
 */
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

    /** Creates an instance of GeneralComponent */
    constructor(private themeService: ThemeService) {}

    /**
     * Toggles theme of the application
     * @param selected id of the selected theme
     */
    toggleTheme(selected: string): void {
        this.themeService.setThemeById(selected);
    }
}
