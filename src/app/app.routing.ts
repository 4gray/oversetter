import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const APP_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/translation/translation.module').then(m => m.TranslationModule),
    },
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
