import Rule from "../../lexing/rules/util/Rule";
import NonTerminal from "../../lexing/rules/util/NonTerminal";
import Terminal from "../../lexing/rules/util/Terminal";

const fs = require('fs');


export function buildParsingTree(rules: Rule[]) {
	rules = rules.reverse();

	let pointer = 0;
	let tree = new Node();

	function buildNode(rules: Rule[], parentNode: Node) {

		if (pointer < rules.length) {
			let rule = rules[pointer];
			pointer ++;

			let node = new Node(rule.lhs, rule);
			parentNode.addChild(node);

			rule.rhs.forEach(symbol => {
				if (symbol instanceof Terminal) {
					node.addChild(
						new Node(symbol)
					);
				} else {
					buildNode(rules, node);
				}
			});
		}
	}

	buildNode(rules, tree);

	console.log(__dirname);

	fs.writeFile('./visualize/flare.json', JSON.stringify(tree), function(err) {
		console.log(err)
	});

	return tree;
}


export class Node {
	public nonTerm?: Terminal | NonTerminal;
	public children?: Node[] = [];
	public rule?: Rule;

	public name: string;

	constructor(nonTerm?: Terminal | NonTerminal, rule?: Rule) {
		this.nonTerm = nonTerm;
		this.rule = rule;

		this.name = nonTerm ?
			(nonTerm instanceof Terminal
				? nonTerm.getTag()
				: nonTerm.getName())
			: 'NO VALUE';
	}

	addChild(node: Node) {
		this.children.push(node);
	}
}

function treeToJSON(tree: Node) {
	let result = {}
}

