export default class Scope {
    private table;
    private parent;
    constructor(parent: Scope);
    get(key: string): any;
    set(key: string, value: string): void;
}
