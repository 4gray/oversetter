import { ModuleWithProviders } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';


const APP_ROUTES: Routes = [
    {
        path: '',
        loadChildren: './modules/translation/translation.module#TranslationModule'
    }
];


export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
