import { Language } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import * as ConfigActions from '../actions/config.actions';

export type LanguageMode = 'all-languages' | 'preferred-languages';

export type RuntimeSettings = 'apiKey' | 'theme' | 'fromLang' | 'toLang' | 'languageMode' | 'preferredLanguages';
export type GeneralSettings = 'autolaunch' | 'alwaysOnTop' | 'showDockIcon';

/** Local storage settings key */
export const CONFIG_STORAGE_KEY = 'oversetter.config';

export interface ConfigState {
    autolaunch: boolean;
    alwaysOnTop: boolean;
    showDockIcon: boolean;
    apiKey: string;
    theme: string;
    fromLang: Language;
    toLang: Language;
    languageMode: LanguageMode;
    preferredLanguages: Language[];
}

export const initialState: ConfigState = load();

function loadInitialConfig(): ConfigState {
    return {
        autolaunch: false,
        alwaysOnTop: false,
        showDockIcon: false,
        apiKey: 'trnsl.1.1.20160306T121040Z.ce3153278463656c.38be842aceb435f1c023544f5571eb64e2c01fdf',
        theme: 'light',
        fromLang: new Language('en', 'English'),
        toLang: new Language('de', 'German'),
        languageMode: 'all-languages',
        preferredLanguages: [],
    };
}

/* TODO:
new setting -> window position */

function load(): ConfigState {
    const config = localStorage.getItem(CONFIG_STORAGE_KEY);
    let result = loadInitialConfig();
    if (config) {
        console.log('configuration exists...');
        try {
            result = JSON.parse(config);
            console.log('successfully loaded the existing configuration...');
        } catch (error) {
            console.error('the current configuration is corrupt, reset config and init defaults...');
            setConfigToLocalStorage(result);
        }
    } else {
        console.log('set default configuration...');
        setConfigToLocalStorage(result);
    }
    return result;
}

function setConfigToLocalStorage(config: ConfigState): void {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

const configReducer = createReducer(
    initialState,
    on(ConfigActions.updateConfig, (state, { config }) => ({ ...state, ...config }))
);

export function reducer(state: ConfigState | undefined, action: Action): ConfigState {
    return configReducer(state, action);
}

export const selectConfig = (state: ConfigState) => state;
