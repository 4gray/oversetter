export class Language {
    private key: string;
    private value: string;

    /**
     *Creates an instance of Language.
     * @param {string} key language key/code
     * @param {string} value language label
     * @memberof Language
     */
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    /**
     * Getter $key
     * @return {string}
     */
    public get $key(): string {
        return this.key;
    }

    /**
     * Getter $value
     * @return {string}
     */
    public get $value(): string {
        return this.value;
    }

    /**
     * Setter $key
     * @param {string} value
     */
    public set $key(value: string) {
        this.key = value;
    }

    /**
     * Setter $value
     * @param {string} value
     */
    public set $value(value: string) {
        this.value = value;
    }

}
