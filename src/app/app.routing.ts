import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from '@modules/translation/about/about.component';
import { DictionaryComponent } from '@modules/dictionary/dictionary/dictionary.component';
import { MainComponent } from '@modules/translation/main/main.component';
import { OfflineComponent } from '@modules/translation/offline/offline.component';
import { SettingsComponent } from '@modules/settings/settings/settings.component';


const ROUTE_CONFIG: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: MainComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'offline',
        component: OfflineComponent
    },
    {
        path: 'dictionary',
        component: DictionaryComponent
    }
];


@NgModule({
    imports: [RouterModule.forRoot(ROUTE_CONFIG)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
