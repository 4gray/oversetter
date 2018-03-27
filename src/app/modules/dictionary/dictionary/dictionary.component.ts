import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    templateUrl: 'dictionary.component.html'
})

export class DictionaryComponent {
    /**
     * Vocabulary array
     *
     * @memberof DictionaryComponent
     */
    public vocabulary = [];
    /**
     * Selected vocabulary
     *
     * @memberof DictionaryComponent
     */
    public selectedItem = {};
    /**
     * Highlighted row
     *
     * @memberof DictionaryComponent
     */
    public selectedRow;

    /**
     * Creates an instance of DictionaryComponent
     * @param {ElectronService} electronService electron service
     * @memberof DictionaryComponent
     */
    constructor(private electronService: ElectronService) {
        console.log(localStorage.getItem('vocabulary'));
        this.vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
    }

    /**
     * Update dictionary from localstorage
     *
     * @memberof DictionaryComponent
     */
    public updateDictionary() {
        this.vocabulary = JSON.parse(localStorage.getItem('vocabulary'));
    }

    /**
     * Show translation of selected item and set highlighting of element in the app sidebar
     * @param item current item
     * @param index index of item
     */
    public setSelectedItem(item: object, index: number) {
        this.selectedItem = item;
        this.selectedRow = index;
    }

    /**
     * Remove provided item from the list by selected list index
     */
    public removeItem() {
        this.vocabulary.splice(this.selectedRow, 1);
        localStorage.setItem('vocabulary', JSON.stringify(this.vocabulary));
        this.selectedItem = {};
        this.selectedRow = -1;
    }
}
