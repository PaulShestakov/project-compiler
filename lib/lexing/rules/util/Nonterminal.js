"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NonTerminal = (function () {
    function NonTerminal(name) {
        this.name = name;
    }
    NonTerminal.prototype.getName = function () {
        return this.name;
    };
    NonTerminal.prototype.toString = function () {
        return "(NONTERMINAL: " + this.getName() + ")";
    };
    NonTerminal.prototype.equals = function (nonterm) {
        return nonterm instanceof NonTerminal
            && nonterm.getName() === this.getName();
    };
    return NonTerminal;
}());
exports.default = NonTerminal;
//# sourceMappingURL=NonTerminal.js.map