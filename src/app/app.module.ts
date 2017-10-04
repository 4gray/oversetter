import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { TabComponent } from './settings/tab.component';
import { TabsComponent } from './settings/tabs.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HttpModule } from '@angular/http';
import { KeysPipe } from './keys.pipe';
import { routing } from './app.routes';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, NgxElectronModule, routing],
    declarations: [HomeComponent, MainComponent, SettingsComponent, AboutComponent, TabsComponent, TabComponent, KeysPipe],
    bootstrap: [HomeComponent],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: 'main'
        }
    ]
})

export class AppModule { }
