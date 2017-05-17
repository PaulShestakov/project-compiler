

import Rule from "../../lexing/rules/util/Rule";

export default class Item {
	constructor(public rule: Rule, public marker: number) {}

	equals(item: Item) {
		return this.rule.equals(item.rule)
			&& this.marker === item.marker;
	}
}