import { Component, Input } from '@angular/core';

@Component({
	selector: 'tab',
	template: `
		<div class="settings-tab-content" [hidden]="!active">
			<div class="settings-container">
				<ng-content></ng-content>
			</div>
		</div>
	`
})

export class TabComponent {
	@Input('tabTitle') title: string;
	@Input() active = false;
}