import { AppRoutingModule } from '@app/app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { SharedModule } from '@modules/shared/shared.module';
import { HomeComponent } from './modules/translation';
import { SettingsModule } from './modules/settings/settings.module';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        ClickOutsideModule,
        FormsModule,
        HttpClientModule,
        NgxElectronModule,
        SettingsModule,
        SharedModule
    ],
    declarations: [
        HomeComponent
    ],
    bootstrap: [
        HomeComponent
    ]
})

export class AppModule { }
