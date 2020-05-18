export class Language {
    key: string;
    value: string;

    /**
     * Creates an instance of Language.
     * @param key language key/code
     * @param value language label
     */
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}
