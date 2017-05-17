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
    return Token;
}());
exports.default = Token;
//# sourceMappingURL=Token.js.map