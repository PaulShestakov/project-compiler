export default class Token {
    private tag;
    private value;
    constructor(tag: string, value?: any);
    getTag(): string;
    getValue(): any;
}
