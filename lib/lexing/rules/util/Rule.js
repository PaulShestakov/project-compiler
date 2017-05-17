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
    return Rule;
}());
exports.default = Rule;
//# sourceMappingURL=Rule.js.map