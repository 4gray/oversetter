import { NgModule } from '@angular/core';
import { DictionaryComponent } from '.';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        DictionaryComponent
    ]
})
export class DictionaryModule { }
