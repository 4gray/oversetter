import { Component, EventEmitter } from '@angular/core';
import { DictionaryItem } from '@app/models/dictionary-item';
import { StorageService } from '@app/services/storage.service';
import { ThemeService } from '@app/services/theme.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

/**
 * Dictionary component
 *
 * @export
 * @class DictionaryComponent
 */
@UntilDestroy()
@Component({
    templateUrl: 'dictionary.component.html',
    styleUrls: ['dictionary.component.scss'],
})
export class DictionaryComponent {
    /** Vocabulary array */
    vocabulary: DictionaryItem[] = [];
    /** Selected vocabulary */
    selectedItem: DictionaryItem = null;
    /** Highlighted row in the sidebar */
    selectedRow;

    /**
     * Creates an instance of DictionaryComponent
     * @param storageService
     * @param themeService
     */
    constructor(private storageService: StorageService, private themeService: ThemeService) {
        this.vocabulary = storageService.getVocabulary();
        this.themeService.enableActiveTheme();

        storageService.dictionaryChange.pipe(untilDestroyed(this)).subscribe(() => {
            this.updateDictionary();
        });
    }

    /**
     * Updates dictionary content from the local storage
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
