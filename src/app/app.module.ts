import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from '@app/app.routing';
import { DictionaryComponent } from '@modules/dictionary/dictionary/dictionary.component';
import { HomeComponent } from '@modules/translation/home/home.component';

import { MainComponent } from '@modules/translation/main/main.component';
import { OfflineComponent } from '@modules/translation/offline/offline.component';
import { SettingsComponent } from '@modules/settings/settings/settings.component';
import { TranslateService } from '@services/translate.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StorageService } from '@app/services/storage.service';
import { UiService } from '@app/services/ui.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { LanguageSettingsComponent } from '@modules/settings/language-settings/language-settings.component';
import { AboutComponent } from '@modules/settings/about/about.component';
import { ApiGuardService } from './services/api-guard.service';
import { SettingsService } from './services/settings.service';
import { LangResolver } from './services/lang.resolver';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        NgxElectronModule,
        AppRoutingModule,
        FlexLayoutModule,
        NgSelectModule,
        ClickOutsideModule
    ],
    declarations: [
        HomeComponent,
        MainComponent,
        SettingsComponent,
        OfflineComponent,
        DictionaryComponent,
        LanguageSettingsComponent,
        AboutComponent
    ],
    bootstrap: [
        HomeComponent
    ],
    providers: [
        TranslateService,
        StorageService,
        UiService,
        ApiGuardService,
        SettingsService,
        LangResolver
    ]
})

export class AppModule { }
