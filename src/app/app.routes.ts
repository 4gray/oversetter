import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { MainComponent } from './main/main.component';
import { OfflineComponent } from "./offline/offline.component";
import { SettingsComponent } from './settings/settings.component';

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
