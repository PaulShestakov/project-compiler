
import Tag from "../../util/Tag";


export default class Terminal {
	private tag: string;

	constructor(tag: string) {
		this.tag = tag;
	}

	getTag() {
		return this.tag;
	}

	toString() {
		return `<TERMINAL: ${this.getTag()}>`;
	}

	equals(term: Terminal) {
		return term instanceof Terminal
			&& term.getTag() === this.getTag();
	}
}
