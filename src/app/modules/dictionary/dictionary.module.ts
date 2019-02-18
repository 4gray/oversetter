import { NgModule } from '@angular/core';
import { DictionaryComponent } from '.';
import { SharedModule } from '../shared/shared.module';
import { DictionaryRoutes } from './dictionary.routing';

@NgModule({
    imports: [
        DictionaryRoutes,
        SharedModule
    ],
    declarations: [
        DictionaryComponent
    ]
})
export class DictionaryModule { }
