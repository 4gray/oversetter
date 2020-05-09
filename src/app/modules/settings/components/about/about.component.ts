import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { environment } from 'environments/environment';

/**
 * About component
 */
@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
    /** Emits to the parent component with clicked URL link */
    @Output() linkClicked: EventEmitter<string> = new EventEmitter();

    /** Current version of the application */
    VERSION = environment.VERSION;

    /** Description of the application */
    DESCRIPTION = environment.DESCRIPTION;
}
