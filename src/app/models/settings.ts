import { Language } from '@app/models/language';
import { DictionaryItem } from '@app/models/dictionary-item';

export interface Settings {
    fromLang: Language;
    toLang: Language;
    vocabulary: DictionaryItem[];
}
