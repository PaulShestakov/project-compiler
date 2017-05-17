"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Terminal_1 = require("./util/Terminal");
var fs = require('fs');
var Tag_1 = require("../util/Tag");
var Rule_1 = require("./util/Rule");
var Nonterminal_1 = require("./util/Nonterminal");
var RulesParser = (function () {
    function RulesParser() {
    }
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
                    return new Nonterminal_1.default(element);
                }
            });
            return new Rule_1.default(new Nonterminal_1.default(lhs), rhsElements);
        });
    };
    return RulesParser;
}());
exports.default = RulesParser;
//# sourceMappingURL=RulesParser.js.map