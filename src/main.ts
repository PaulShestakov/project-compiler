
import RulesParser from "./lexing/rules/RulesParser";
import Rule from "./lexing/rules/util/Rule";
import { start } from "repl";
import Token from "../lib/lexing/util/Token";

import Lexer from './lexing/Lexer';
import Tag from './lexing/util/Tag';
import { Parser } from "./parsing/Parser";





function main() {
	let tokens = getTokens('./text.txt');

	let rules = RulesParser.getRules('./testB.txt');
	let grammarSymbols = RulesParser.getGrammarSymbols(rules);

	let parser = new Parser(rules, tokens, grammarSymbols);
	parser.parse();
}

main();







function getTokens(fileName: string): Token[] {
	let lexer = new Lexer(fileName);

	let tokens = [];

	while (true) {
		let nextToken = lexer.nextToken();
		tokens.push(nextToken);

		if (nextToken.getTag() === Tag.EOF) {
			break;
		}
	}

	return tokens;
}
