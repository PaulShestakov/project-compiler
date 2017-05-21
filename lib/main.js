"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RulesParser_1 = require("./lexing/rules/RulesParser");
var Lexer_1 = require("./lexing/Lexer");
var Tag_1 = require("./lexing/util/Tag");
var Parser_1 = require("./parsing/Parser");
function main() {
    var tokens = getTokens('./text.txt');
    var rules = RulesParser_1.default.getRules('./testB.txt');
    var grammarSymbols = RulesParser_1.default.getGrammarSymbols(rules);
    var parser = new Parser_1.Parser(rules, tokens, grammarSymbols);
    parser.parse();
}
main();
function getTokens(fileName) {
    var lexer = new Lexer_1.default(fileName);
    var tokens = [];
    while (true) {
        var nextToken = lexer.nextToken();
        tokens.push(nextToken);
        if (nextToken.getTag() === Tag_1.default.EOF) {
            break;
        }
    }
    return tokens;
}
//# sourceMappingURL=main.js.map