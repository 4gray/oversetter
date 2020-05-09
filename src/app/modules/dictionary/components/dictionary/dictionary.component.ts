import { Component, EventEmitter } from '@angular/core';
import { DictionaryItem } from '@app/models/dictionary-item';
import { StorageService } from '@app/services/storage.service';

/**
 * Dictionary component
 *
 * @export
 * @class DictionaryComponent
 */
@Component({
    templateUrl: 'dictionary.component.html',
    styleUrls: ['dictionary.component.scss'],
})
export class DictionaryComponent {
    /** Vocabulary array */
    vocabulary: DictionaryItem[] = [];

    /** Selected vocabulary */
    selectedItem: DictionaryItem = null;

    /** Highlighted row */
    public selectedRow;

    /**
     * Creates an instance of DictionaryComponent
     * @param electronService electron service
     */
    constructor(private storageService: StorageService) {
        this.vocabulary = storageService.getVocabulary();

        storageService.dictionaryChange.subscribe(changes => {
            this.updateDictionary();
        });
    }

    /**
     * Update dictionary from local storage
     */
    updateDictionary(): void {
        this.vocabulary = this.storageService.getVocabulary();
    }

    /**
     * Show translation of selected item and set highlighting of element in the app sidebar
     * @param item current item
     * @param index index of item
     */
    setSelectedItem(item: DictionaryItem, index: number): void {
        this.selectedItem = item;
        this.selectedRow = index;
    }

    /**
     * Remove provided item from the list by selected list index
     */
    removeItem(): void {
        this.vocabulary.splice(this.selectedRow, 1);
        this.storageService.updateVocabulary(this.vocabulary);
        this.selectedItem = null;
        this.selectedRow = -1;
    }
}
