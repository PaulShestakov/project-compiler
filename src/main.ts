import RulesParser from "./lexing/rules/RulesParser";
import Token from "./lexing/util/Token";
import Lexer from './lexing/Lexer';
import { Parser } from "./parsing/Parser";
import Rule from "./lexing/rules/util/Rule";
import { buildParsingTree } from "./parsing/tree/main";


(function() {
	let lexer = new Lexer('./input/newText2.txt');
	lexer.lex();
	let tokens: Token[] = lexer.getTokens();

	console.log(tokens);

	let rules = RulesParser.getRules('./input/newRules2.txt');
	let grammarSymbols = RulesParser.getGrammarSymbols(rules);

	let parser = new Parser(rules, tokens, grammarSymbols);
	let reducesSequence: Rule[] = parser.parse();

	let tree = buildParsingTree(reducesSequence);






})();
