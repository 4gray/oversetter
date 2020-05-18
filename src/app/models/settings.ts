import { DictionaryItem } from '@app/models/dictionary-item';
import { Language } from '@app/models/language';

export interface Settings {
    fromLang: Language;
    toLang: Language;
    vocabulary: DictionaryItem[];
}
