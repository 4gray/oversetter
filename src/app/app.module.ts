import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { HttpModule } from '@angular/http';
import { KeysPipe } from './keys.pipe';
import { routing } from './app.routes';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, NgxElectronModule, routing],
    declarations: [HomeComponent, MainComponent, SettingsComponent, KeysPipe],
    bootstrap: [HomeComponent],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: 'main'
        }
    ]
})

export class AppModule { }
