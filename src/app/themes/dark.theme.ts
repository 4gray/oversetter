import { Theme } from '@app/services/theme.interface';

export const dark: Theme = {
    name: 'dark',
    properties: {
        '--background-default': '#111',
        '--background-secondary': '#222',
        '--background-tertiary': '#08090A',
        '--background-light': '#111',
        '--background-dark': '#000000',
        '--text-default': '#fff',
        '--text-dark': '#ddd',
        '--text-light': '#eee',
        '--error-default': '#EF3E36',
        '--border-color-primary': '#999',
        '--border-color-secondary': '#333',
        '--border-color-tertiary': '#333',
    },
};
