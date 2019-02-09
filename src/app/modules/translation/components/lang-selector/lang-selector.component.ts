import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostListener,
    ElementRef
} from '@angular/core';
import { Language } from '@app/models/language';

@Component({
    selector: 'app-lang-selector',
    templateUrl: './lang-selector.component.html',
    styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent implements OnInit {

    /**
     * Languages list
     *
     * @type {Language[]}
     * @memberof LangSelectorComponent
     */
    @Input() languages: Language[] = [];

    /**
     * Selected language
     *
     * @memberof LangSelectorComponent
     */
    @Input() selected;

    /**
     * Translation direction
     *
     * @memberof LangSelectorComponent
     */
    @Input() direction;

    /**
     * Change language event emitter
     *
     * @memberof LangSelectorComponent
     */
    @Output() changeLanguage = new EventEmitter();

    /**
     * Auto-detection language object
     *
     * @type {Language}
     * @memberof LangSelectorComponent
     */
    autoDetectLang: Language = new Language('ad', 'Auto-detect');

    /**
     * Is language selected flag
     *
     * @memberof LangSelectorComponent
     */
    isSelected = false;

    constructor(private _elementRef: ElementRef) { }

    ngOnInit() { }

    /**
     * Changes selected to the given language
     *
     * @param {Language} lang
     * @memberof LangSelectorComponent
     */
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
