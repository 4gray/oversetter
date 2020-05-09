import { RouterModule, Routes } from '@angular/router';
import { DictionaryComponent } from '.';

const routes: Routes = [
    {
        path: 'dictionary',
        component: DictionaryComponent,
    },
];

export const DictionaryRoutes = RouterModule.forChild(routes);
