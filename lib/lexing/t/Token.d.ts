import Tag from './Tag';
export default class Token {
    private tag;
    private value;
    constructor(tag: Tag, value?: any);
    getTag(): Tag;
    getValue(): any;
    toString(): string;
}
