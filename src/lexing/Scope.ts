

export default class Scope  {
	private table: object = {};
	private parent: Scope;

	constructor(parent: Scope) {
		this.parent = parent;
	}

	get(key: string) {
		return this.table[key];
	}

	set(key: string, value: string) {
		this.table[key] = value;
	}
}