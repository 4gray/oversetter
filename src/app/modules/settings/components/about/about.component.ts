import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    /**
     * Emits to the parent component with clicked URL link
     *
     * @type {EventEmitter<string>}
     * @memberof AboutComponent
     */
    @Output() linkClicked: EventEmitter<string> = new EventEmitter();

    /**
     * Current version of the application
     *
     * @memberof AboutComponent
     */
    VERSION = environment.VERSION;

    /**
     * Description of the application
     *
     * @memberof AboutComponent
     */
    DESCRIPTION = environment.DESCRIPTION;

    constructor() { }

    ngOnInit(): void { }

}
