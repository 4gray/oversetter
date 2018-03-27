import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from '@modules/translation/about/about.component';
import { DictionaryComponent } from '@modules/dictionary/dictionary/dictionary.component';
import { MainComponent } from '@modules/translation/main/main.component';
import { OfflineComponent } from '@modules/translation/offline/offline.component';
import { SettingsComponent } from '@modules/settings/settings/settings.component';

export const ROUTE_CONFIG: Routes = [
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

export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTE_CONFIG, { useHash: true });
