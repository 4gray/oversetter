import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';
import { AboutComponent } from './about/about.component';
import { routing } from './app.routes';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { HomeComponent } from './home/home.component';
import { KeysPipe } from './keys.pipe';
import { MainComponent } from './main/main.component';
import { OfflineComponent } from './offline/offline.component';
import { SettingsComponent } from './settings/settings.component';
import { TabComponent } from './settings/tab.component';
import { TabsComponent } from './settings/tabs.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        NgxElectronModule,
        routing
    ],
    declarations: [
        HomeComponent,
        MainComponent,
        SettingsComponent,
        AboutComponent,
        OfflineComponent,
        DictionaryComponent,
        TabsComponent,
        TabComponent,
        KeysPipe
    ],
    bootstrap: [HomeComponent],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: 'main'
        }
    ]
})

export class AppModule { }
