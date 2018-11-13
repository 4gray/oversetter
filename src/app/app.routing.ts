import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryComponent } from '@modules/dictionary/dictionary/dictionary.component';
import { MainComponent } from '@modules/translation/main/main.component';
import { OfflineComponent } from '@modules/translation/offline/offline.component';
import { SettingsComponent } from '@modules/settings/settings/settings.component';
import { ApiGuardService as ApiGuard } from '@services/api-guard.service';
import { LangResolver } from './services/lang.resolver';

const ROUTE_CONFIG: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: MainComponent,
        canActivate: [ApiGuard],
        resolve: { languages: LangResolver }
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'offline',
        component: OfflineComponent
    },
    {
        path: 'dictionary',
        component: DictionaryComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    },
];


@NgModule({
    imports: [RouterModule.forRoot(ROUTE_CONFIG)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
