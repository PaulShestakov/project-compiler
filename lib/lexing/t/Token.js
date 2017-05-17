"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token = (function () {
    function Token(tag, value) {
        this.tag = tag;
        this.value = value;
    }
    Token.prototype.getTag = function () {
        return this.tag;
    };
    Token.prototype.getValue = function () {
        return this.value;
    };
    Token.prototype.toString = function () {
        return "\n\t\t\tTAG: '" + this.tag + "'\n\t\t\tVALUE: '" + this.value + "'\n\t\t";
    };
    return Token;
}());
exports.default = Token;
//# sourceMappingURL=Token.js.map