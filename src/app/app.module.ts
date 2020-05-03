import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '@app/app.routing';
import { SharedModule } from '@modules/shared/shared.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxElectronModule } from 'ngx-electron';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HomeComponent } from './modules/translation';
import { ThemeService } from './services/theme.service';

export function themeFactory(themeService: ThemeService): any {
    return () => themeService.enableActiveTheme();
}

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        ClickOutsideModule,
        DictionaryModule,
        FormsModule,
        HttpClientModule,
        NgxElectronModule,
        SettingsModule,
        SharedModule,
    ],
    declarations: [HomeComponent],
    providers: [{ provide: APP_INITIALIZER, useFactory: themeFactory, deps: [ThemeService], multi: true }],
    bootstrap: [HomeComponent],
})
export class AppModule {}
