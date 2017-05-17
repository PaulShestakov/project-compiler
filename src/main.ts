import Lexer from './lexing/Lexer';
import Tag from './lexing/util/Tag';
import RulesParser from "./lexing/rules/RulesParser";






function scan() {

	// let fileName = './test2.txt';
	//
	// let lexer = new Lexer(fileName);
	//
	// let tokens = [];
	//
	// while (true) {
	// 	let nextToken = lexer.nextToken();
	// 	tokens.push(nextToken);
	//
	// 	if (nextToken.getTag() === Tag.EOF) {
	// 		break;
	// 	}
	// }
	//
	// console.log(tokens);


	let rules = RulesParser.getRules('./rules.txt');

	rules.forEach(rule => rule.logRule())

}


scan();