import Tag from "../../util/Tag";
export default class Terminal {
    private tag;
    constructor(tag: Tag);
    getTag(): Tag;
    toString(): string;
}
