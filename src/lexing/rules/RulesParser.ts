const fs = require('fs');

import Terminal from "./util/Terminal";
import Tag from '../util/Tag';
import Rule from "./util/Rule";
import NonTerminal from "./util/NonTerminal";


export default class RulesParser {
	// Parse provided grammar and return it's rules
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
				let rhsParts = parts[1].split('#');

				let rhs = rhsParts[0].trim();

				let semanticRule;
				if (rhsParts[1]) {
					semanticRule = eval(rhsParts[1]);
				}

				let rhsElements = rhs.split(' ')
					.filter(element => !! element)
					.map((element: string): Terminal | NonTerminal => {
						if (/<.*>/.test(element)) {
							let tag = Tag[element.slice(1, -1)];
							return new Terminal(tag);
						}
						else {
							return new NonTerminal(element);
						}
					});

				return new Rule(
					new NonTerminal(lhs),
					rhsElements,
					semanticRule
				);
			});
	}

	// Return all grammar symbols, mentioned in rules, defined by provided grammar
	public static getGrammarSymbols(rules: Rule[]) {
		let result: Array<Terminal|NonTerminal> = [];

		rules.forEach(rule => {
			let ruleSymbols: Array<Terminal|NonTerminal> = [rule.lhs];

			rule.rhs.forEach(symbol => {ruleSymbols.push(symbol)});

			ruleSymbols.forEach(symbol => {

				let found = result.filter(savedSymbol => {
					return savedSymbol.equals(symbol);
				}).length > 0;

				if (!found) {
					result.push(symbol);
				}
			})

		});
		return result;
	}
}