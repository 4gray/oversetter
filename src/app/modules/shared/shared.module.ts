import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        NgSelectModule
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        NgSelectModule,
    ],
    declarations: []
})
export class SharedModule { }
