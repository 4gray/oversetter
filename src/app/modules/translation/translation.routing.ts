import { Routes, RouterModule } from '@angular/router';
import {
    MainComponent,
    OfflineComponent
} from '.';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'offline',
                component: OfflineComponent
            },
            {
                path: 'home',
                component: MainComponent
            }
        ]
    }
];

export const TranslationRoutes = RouterModule.forChild(routes);
