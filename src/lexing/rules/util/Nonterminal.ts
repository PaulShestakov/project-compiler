

export default class Nonterminal {
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

	equals(nonterm: Nonterminal) {
		return nonterm instanceof Nonterminal
			&& nonterm.getName() === this.getName();
	}
}
