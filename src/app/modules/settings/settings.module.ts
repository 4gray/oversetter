import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { AboutComponent, ApiComponent, GeneralComponent, LanguagesComponent, SettingsComponent } from './components';
import { SettingsRoutes } from './settings.routing';

@NgModule({
    imports: [SharedModule, SettingsRoutes],
    declarations: [AboutComponent, ApiComponent, LanguagesComponent, GeneralComponent, SettingsComponent],
})
export class SettingsModule {}
