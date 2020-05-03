import { Theme } from '@app/services/theme.interface';

export const light: Theme = {
    name: 'light',
    properties: {
        '--background-default': '#ffffff',
        '--background-secondary': '#eeeeee',
        '--background-tertiary': '#ececec',
        '--background-light': '#cccccc',
        '--background-dark': '#000000',
        '--text-default': '#444444',
        '--text-dark': '#000000',
        '--text-light': '#666666',
        '--error-default': '#ef3e36',
        '--border-color-primary': '#ededed',
        '--border-color-secondary': '#cccccc',
        '--border-color-tertiary': '#afafaf',
    },
};
