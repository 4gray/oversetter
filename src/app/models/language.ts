export class Language {
    private key: string;
    private value: string;

    /**
     * Creates an instance of Language.
     * @param key language key/code
     * @param value language label
     */
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    /**
     * Getter $key
     */
    public get $key(): string {
        return this.key;
    }

    /**
     * Getter $value
     */
    public get $value(): string {
        return this.value;
    }

    /**
     * Setter $key
     * @param value
     */
    public set $key(value: string) {
        this.key = value;
    }

    /**
     * Setter $value
     * @param value
     */
    public set $value(value: string) {
        this.value = value;
    }
}
