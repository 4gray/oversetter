import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from '@app/app.routing';
import { DictionaryComponent } from '@modules/dictionary/dictionary/dictionary.component';
import { HomeComponent } from '@modules/translation/home/home.component';
import { KeysPipe } from '@pipes/keys.pipe';

import { MainComponent } from '@modules/translation/main/main.component';
import { OfflineComponent } from '@modules/translation/offline/offline.component';
import { SettingsComponent } from '@modules/settings/settings/settings.component';
import { TranslateService } from '@services/translate.service';
import { LangSelectorComponent } from './modules/translation/lang-selector/lang-selector.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StorageService } from '@app/services/storage.service';
import { UiService } from '@app/services/ui.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        NgxElectronModule,
        AppRoutingModule,
        FlexLayoutModule
    ],
    declarations: [
        HomeComponent,
        MainComponent,
        SettingsComponent,
        OfflineComponent,
        DictionaryComponent,
        KeysPipe,
        LangSelectorComponent
    ],
    bootstrap: [
        HomeComponent
    ],
    providers: [
        TranslateService,
        StorageService,
        UiService
    ]
})

export class AppModule { }
