"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Nonterminal = (function () {
    function Nonterminal(name) {
        this.name = name;
    }
    Nonterminal.prototype.getName = function () {
        return this.name;
    };
    Nonterminal.prototype.toString = function () {
        return "(NONTERMINAL: " + this.getName() + ")";
    };
    Nonterminal.prototype.equals = function (nonterm) {
        return nonterm instanceof Nonterminal
            && nonterm.getName() === this.getName();
    };
    return Nonterminal;
}());
exports.default = Nonterminal;
//# sourceMappingURL=Nonterminal.js.map