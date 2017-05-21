

import NonTerminal from "../../lexing/rules/util/NonTerminal";
import Terminal from "../../lexing/rules/util/Terminal";
import Item from "./Item";

let sequenceIndexGenerator = function() {
	let i = 0;
	sequenceIndexGenerator = function() {
		return ++i;
	};
	return 0;
};


export default class Condition {
	private items: Item[];
	private index: number;
	private grammarSymbol: Terminal | NonTerminal;

	constructor(items: Item[], grammarSymbol?: Terminal | NonTerminal) {
		this.items = items;
		this.grammarSymbol = grammarSymbol;
		this.index = sequenceIndexGenerator();
	}

	getItems() {
		return this.items;
	}

	getIndex() {
		return this.index;
	}

	itemsEqual(items: Item[]): boolean {
		return items.length === this.items.length
			&& this.items.every(thisItem => {
				return items.filter(item => item.equals(thisItem)).length > 0;
			});
	}
}