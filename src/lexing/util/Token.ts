import Tag from './Tag';

export default class Token {
	private tag: string;
	private value: any;

	constructor(tag: string, value?: any) {
		this.tag = tag;
		this.value = value;
	}

	public getTag(): string {
		return this.tag;
	}

	public getValue(): any {
		return this.value;
	}
}