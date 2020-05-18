import { Injectable } from '@angular/core';
import * as fromConfig from '@app/store/reducers';
import { dark, light } from '@app/themes';
import { select, Store } from '@ngrx/store';
import { Theme } from './theme.interface';
import { updateConfig } from '@app/store/actions/config.actions';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private active: Theme = light;
    private availableThemes: Theme[] = [light, dark];

    constructor(private store: Store) {
        this.store.pipe(select(fromConfig.getConfig)).subscribe(config => {
            this.active = this.getThemeById(config.theme);
            this.setThemeById(this.active.name);
        });
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

    enableActiveTheme(): void {
        this.setCssValues(this.active);
    }

    setCssValues(theme: Theme): void {
        Object.keys(theme.properties).forEach(property => {
            document.documentElement.style.setProperty(property, theme.properties[property]);
        });
    }
}
