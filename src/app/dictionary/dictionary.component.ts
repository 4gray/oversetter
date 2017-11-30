import { Component } from "@angular/core";
import { ElectronService } from 'ngx-electron';

@Component({
    templateUrl: 'dictionary.component.html'
})

export class DictionaryComponent {
    public vocabulary = [];
    public selectedItem = {};
    public selectedRow;

    constructor(private electronService: ElectronService) {
        console.log(localStorage.getItem('vocabulary'));
        this.vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
    }


    updateDictionary() {
        this.vocabulary = JSON.parse(localStorage.getItem('vocabulary'));
    }

    /**
     * Show translation of selected item and set highlighting of element in the app sidebar
     * @param item 
     * @param index 
     */
    setSelectedItem(item:Object, index:number) {
        this.selectedItem = item;
        this.selectedRow = index;
    }

    /**
     * Remove provided item from the list by selected list index
     */
    removeItem() {
        this.vocabulary.splice(this.selectedRow, 1);
        localStorage.setItem('vocabulary', JSON.stringify(this.vocabulary));
        this.selectedItem = {};
        this.selectedRow = -1;
    }
}