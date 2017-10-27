import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
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
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTE_CONFIG, { useHash: true });