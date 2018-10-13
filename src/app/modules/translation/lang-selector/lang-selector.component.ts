import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Language } from '@app/models/language';

@Component({
    selector: 'app-lang-selector',
    templateUrl: './lang-selector.component.html',
    styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent implements OnInit {

    @Input() languages: Language[] = [];
    @Input() selected;
    @Input() direction;
    @Output() changeLanguage = new EventEmitter();
    autoDetectLang: Language = new Language('ad', 'Auto-detect');

    isSelected = false;

    constructor(private _elementRef: ElementRef) { }

    ngOnInit() { }

    switchLanguage(lang: Language) {
        this.changeLanguage.emit(lang);
        this.toggleSelected();
    }

    toggleSelected() {
        this.isSelected = !this.isSelected;
    }

    @HostListener('document:click', ['$event.path'])
    public onGlobalClick(targetElementPath: Array<any>) {
        const elementRefInPath = targetElementPath.find(e => e === this._elementRef.nativeElement);
        if (!elementRefInPath) {
            this.isSelected = false;
        }
    }

}
