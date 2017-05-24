import RulesParser from "./lexing/rules/RulesParser";
import Token from "../lib/lexing/util/Token";
import Lexer from './lexing/Lexer';
import Tag from './lexing/util/Tag';
import { Parser } from "./parsing/Parser";


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


function main() {
	let tokens = getTokens('./input/newText.txt');

	console.log(tokens);

	let rules = RulesParser.getRules('./input/newRules.txt');
	let grammarSymbols = RulesParser.getGrammarSymbols(rules);

	let parser = new Parser(rules, tokens, grammarSymbols);
	parser.parse();
}

main();
