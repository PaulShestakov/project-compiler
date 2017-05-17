import Terminal from "./util/Terminal";
const fs = require('fs');

import { assert } from '../../util';
import Tag from '../util/Tag';
import Rule from "./util/Rule";
import Nonterminal from "./util/Nonterminal";


export default class RulesParser {
	public static getRules(fileName) {
		let fileContents = fs.readFileSync(fileName, 'utf8');

		return fileContents
			// Split rules
			.split(';')

			// Remove spaces
			.map(ruleString => ruleString.trim())

			.filter(ruleString => !!ruleString)

			// Split multirules
			.map(ruleString => {
				let parts = ruleString.split('->');

				let lhs = parts[0];
				let rhs = parts[1];

				return rhs.split('|').map(rhsPart => lhs + '->' + rhsPart);
			})

			// Reduce to single array
			.reduce((acc, curr) => {
				return acc.concat(curr);
			}, [])

			// Parse rule string
			.map(ruleString => {
				let parts = ruleString.split('->');

				let lhs = parts[0].trim();
				let rhs = parts[1].trim();

				let rhsElements = rhs.split(' ')
					.filter(element => !! element)
					.map(element => {
						if (/<.*>/.test(element)) {
							let tag = Tag[element.slice(1, -1)];
							return new Terminal(tag);
						}
						else {
							return new Nonterminal(element);
						}
					});

				return new Rule(
					new Nonterminal(lhs),
					rhsElements
				);
			});
	}
}