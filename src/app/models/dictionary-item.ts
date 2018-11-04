import { Language } from '@app/models/language';

export interface DictionaryItem {
    text: string;
    translation: string;
    fromLang: Language;
    toLang: Language;
}
