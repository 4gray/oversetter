import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '@app/services/theme.service';
import { ConfigState } from '@app/store/reducers/config.reducer';

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
    @Input() settings: ConfigState;

    /** Emits an changed option to the parent component */
    @Output() optionChanged: EventEmitter<Partial<ConfigState>> = new EventEmitter();

    /** Get all available themes */
    availableThemes = this.themeService.getAvailableThemes();

    /** Creates an instance of GeneralComponent */
    constructor(private themeService: ThemeService) {}
}
