"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Terminal_1 = require("./util/Terminal");
var fs = require('fs');
var Tag_1 = require("../util/Tag");
var Rule_1 = require("./util/Rule");
var NonTerminal_1 = require("./util/NonTerminal");
var RulesParser = (function () {
    function RulesParser() {
    }
    // Parse provided grammar and return it's rules
    RulesParser.getRules = function (fileName) {
        var fileContents = fs.readFileSync(fileName, 'utf8');
        return fileContents
            .split(';')
            .map(function (ruleString) { return ruleString.trim(); })
            .filter(function (ruleString) { return !!ruleString; })
            .map(function (ruleString) {
            var parts = ruleString.split('->');
            var lhs = parts[0];
            var rhs = parts[1];
            return rhs.split('|').map(function (rhsPart) { return lhs + '->' + rhsPart; });
        })
            .reduce(function (acc, curr) {
            return acc.concat(curr);
        }, [])
            .map(function (ruleString) {
            var parts = ruleString.split('->');
            var lhs = parts[0].trim();
            var rhs = parts[1].trim();
            var rhsElements = rhs.split(' ')
                .filter(function (element) { return !!element; })
                .map(function (element) {
                if (/<.*>/.test(element)) {
                    var tag = Tag_1.default[element.slice(1, -1)];
                    return new Terminal_1.default(tag);
                }
                else {
                    return new NonTerminal_1.default(element);
                }
            });
            return new Rule_1.default(new NonTerminal_1.default(lhs), rhsElements);
        });
    };
    // Return all grammar symbols, mentioned in rules, defined by provided grammar
    RulesParser.getGrammarSymbols = function (rules) {
        var result = [];
        rules.forEach(function (rule) {
            var ruleSymbols = [rule.lhs];
            rule.rhs.forEach(function (symbol) { ruleSymbols.push(symbol); });
            ruleSymbols.forEach(function (symbol) {
                var found = result.filter(function (savedSymbol) {
                    return savedSymbol.equals(symbol);
                }).length > 0;
                if (!found) {
                    result.push(symbol);
                }
            });
        });
        return result;
    };
    return RulesParser;
}());
exports.default = RulesParser;
//# sourceMappingURL=RulesParser.js.map