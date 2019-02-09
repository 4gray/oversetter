import {
    Routes,
    RouterModule
} from '@angular/router';
import { SettingsComponent } from '.';

const routes: Routes = [
    {
        path: 'settings',
        component: SettingsComponent
    }
];

export const SettingsRoutes = RouterModule.forChild(routes);
