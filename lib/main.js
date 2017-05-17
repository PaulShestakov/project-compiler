"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RulesParser_1 = require("./lexing/rules/RulesParser");
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
    var rules = RulesParser_1.default.getRules('./rules.txt');
    rules.forEach(function (rule) { return rule.logRule(); });
}
scan();
//# sourceMappingURL=main.js.map