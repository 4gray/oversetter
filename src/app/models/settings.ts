import { Language } from './language';

interface ISettings {
    alwaysOnTop: boolean;
    apiKey: string;
    autolaunch: boolean;
    languages: string;
    fromLang: Language;
    toLang: Language;
    preferedLanguageList: Language[];
    showDockIcon: boolean;
}

export class Settings implements ISettings {
    alwaysOnTop = false;
    apiKey = '';
    autolaunch = false;
    languages = 'all-languages';
    fromLang = { key: 'en', value: 'English' };
    toLang = { key: 'ru', value: 'Russian' };
    preferedLanguageList = [];
    showDockIcon = false;
}
