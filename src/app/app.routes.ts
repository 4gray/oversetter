import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent }   from './main.component';
import { HomeComponent }   from './home.component';
import { SettingsComponent }   from './settings.component';
export const ROUTE_CONFIG: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    {
        path: 'main',
        component: MainComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTE_CONFIG, { useHash: true });