import { NgModule } from '@angular/core';
import {
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
        SettingsComponent
    ]
})
export class SettingsModule { }
