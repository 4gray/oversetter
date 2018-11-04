import { Component, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';
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
    styleUrls: ['dictionary.component.scss']
})

export class DictionaryComponent {
    /**
     * Vocabulary array
     *
     * @memberof DictionaryComponent
     */
    public vocabulary: DictionaryItem[] = [];
    /**
     * Selected vocabulary
     *
     * @memberof DictionaryComponent
     */
    public selectedItem: DictionaryItem = null;
    /**
     * Highlighted row
     *
     * @memberof DictionaryComponent
     */
    public selectedRow;

    /**
     * Creates an instance of DictionaryComponent
     * @param {StorageService} storageService storage service
     * @memberof DictionaryComponent
     */
    constructor(private storageService: StorageService) {
        this.vocabulary = storageService.getVocabulary();

        // subscribe for changes
        window.addEventListener('storage', (event: StorageEvent) => {
            if (event.key === 'oversetter.vocabulary') {
                this.refreshDictionary();
            }
        });
    }

    /**
     * Update dictionary from localstorage
     *
     * @memberof DictionaryComponent
     */
    public refreshDictionary(): void {
        this.vocabulary = this.storageService.getVocabulary();
    }

    /**
     * Show translation of selected item and set highlighting of element in the app sidebar
     * @param item current item
     * @param index index of item
     */
    public setSelectedItem(item: DictionaryItem, index: number): void {
        this.selectedItem = item;
        this.selectedRow = index;
    }

    /**
     * Remove provided item from the list by selected list index
     *
     * @memberof DictionaryComponent
     */
    public removeItem(): void {
        this.vocabulary.splice(this.selectedRow, 1);
        this.storageService.updateVocabulary(this.vocabulary);
        this.selectedItem = null;
        this.selectedRow = -1;
    }
}
