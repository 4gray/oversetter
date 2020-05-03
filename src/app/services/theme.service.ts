import { Injectable } from '@angular/core';
import { AppSettings } from '@app/models';
import { dark, light } from '@app/themes';
import { Theme } from './theme.interface';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private active: Theme = light;
    private availableThemes: Theme[] = [light, dark];

    constructor() {
        this.active = this.getThemeById(AppSettings.$theme);
        this.setThemeById(this.active.name);
    }

    getAvailableThemes(): string[] {
        return this.availableThemes.map(theme => theme.name);
    }

    getThemeById(id: string): Theme {
        return this.availableThemes.find(theme => theme.name === id);
    }

    setThemeById(id: string): void {
        const selectedTheme = this.availableThemes.find(theme => theme.name === id);
        this.setCssValues(selectedTheme);
    }

    setActiveTheme(theme: string): void {
        this.active = this.getThemeById(theme);
    }

    enableActiveTheme(): void {
        this.setCssValues(this.active);
    }

    setCssValues(theme: Theme): void {
        Object.keys(theme.properties).forEach(property => {
            document.documentElement.style.setProperty(property, theme.properties[property]);
        });
    }
}
