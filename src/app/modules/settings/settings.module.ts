import { NgModule } from '@angular/core';
import {
    AboutComponent,
    SettingsComponent
} from '.';
import { SharedModule } from '@modules/shared/shared.module';
import { SettingsRoutes } from './settings.routing';

@NgModule({
    imports: [
        SharedModule,
        SettingsRoutes
    ],
    declarations: [
        AboutComponent,
        SettingsComponent
    ]
})
export class SettingsModule { }
