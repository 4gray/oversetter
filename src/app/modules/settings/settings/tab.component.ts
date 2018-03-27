import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tab',
    template: `
		<div class="settings-tab-content" [hidden]="!active">
			<div class="settings-container">
				<ng-content></ng-content>
			</div>
		</div>
	`
})

export class TabComponent {
    @Input() tabTitle = '';
    @Input() active = false;
}
