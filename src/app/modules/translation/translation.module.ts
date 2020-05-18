import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { MainComponent, OfflineComponent } from '.';
import { TranslationRoutes } from './translation.routing';

@NgModule({
    imports: [SharedModule, TranslationRoutes],
    declarations: [MainComponent, OfflineComponent],
})
export class TranslationModule {}
