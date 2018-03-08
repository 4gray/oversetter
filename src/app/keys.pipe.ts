import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
    public transform(value: string[], args: string[]): any {
        const keys: any[] = [];
        // tslint:disable-next-line:forin
        for (const key in value) {
            keys.push({ key, value: value[key] });
        }
        return keys;
    }
}
