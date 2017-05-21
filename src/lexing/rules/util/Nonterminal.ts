export default class NonTerminal {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	getName() {
		return this.name;
	}

	toString() {
		return `(NONTERMINAL: ${this.getName()})`;
	}

	equals(nonterm: any) {
		return nonterm instanceof NonTerminal
			&& nonterm.getName() === this.getName();
	}
}
