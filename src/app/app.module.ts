import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AboutComponent } from '@modules/translation/about/about.component';
import { routing } from '@app/app.routing';
import { DictionaryComponent } from '@modules/dictionary/dictionary/dictionary.component';
import { HomeComponent } from '@modules/translation/home/home.component';
import { KeysPipe } from '@pipes/keys.pipe';

import { MainComponent } from '@modules/translation/main/main.component';
import { OfflineComponent } from '@modules/translation/offline/offline.component';
import { SettingsComponent } from '@modules/settings/settings/settings.component';
import { TabComponent } from '@modules/settings/settings/tab.component';
import { TabsComponent } from '@modules/settings/settings/tabs.component';
import { TranslateService } from '@services/translate.service';
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
        TranslateService,
        {
            provide: APP_BASE_HREF,
            useValue: 'main'
        }
    ]
})

export class AppModule { }
