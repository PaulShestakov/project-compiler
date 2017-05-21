export default class Terminal {
    private tag;
    constructor(tag: string);
    getTag(): string;
    toString(): string;
    equals(term: any): boolean;
}
