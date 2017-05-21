"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rule = (function () {
    function Rule(lhs, rhs) {
        this.lhs = lhs;
        this.rhs = rhs;
    }
    Rule.prototype.logRule = function () {
        console.log(this.lhs + ' -> ' + this.rhs.join(' '));
    };
    Rule.prototype.equals = function (rule) {
        return this.lhs.equals(rule.lhs)
            && this.rhs.length === rule.rhs.length
            && this.rhs.every(function (elem, index) {
                return elem.equals(rule.rhs[index]);
            });
    };
    return Rule;
}());
exports.default = Rule;
//# sourceMappingURL=Rule.js.map