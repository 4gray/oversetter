import { NgModule } from '@angular/core';
import {
    OfflineComponent,
    LangSelectorComponent,
    MainComponent
} from '.';
import { TranslationRoutes } from './translation.routing';
import { SharedModule } from '@modules/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        TranslationRoutes
    ],
    declarations: [
        LangSelectorComponent,
        MainComponent,
        OfflineComponent
    ]
})
export class TranslationModule { }
