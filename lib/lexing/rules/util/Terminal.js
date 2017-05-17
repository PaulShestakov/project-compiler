"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Terminal = (function () {
    function Terminal(tag) {
        this.tag = tag;
    }
    Terminal.prototype.getTag = function () {
        return this.tag;
    };
    Terminal.prototype.toString = function () {
        return "<TERMINAL: " + this.getTag() + ">";
    };
    Terminal.prototype.equals = function (term) {
        return term instanceof Terminal
            && term.getTag() === this.getTag();
    };
    return Terminal;
}());
exports.default = Terminal;
//# sourceMappingURL=Terminal.js.map