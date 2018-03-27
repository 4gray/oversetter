import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="options-panel">
        <div id="tabs">
            <div *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active-tab]="tab.active">{{tab.tabTitle}}</div>
        </div>
    </div>
    <ng-content></ng-content>
  `
})

export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;

  // contentChildren are set
  public ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter(tab => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  private selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(item => item.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }

}
