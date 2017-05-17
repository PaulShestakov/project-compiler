"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tag_1 = require("./Tag");
var SYMBOLS = {
    '{': Tag_1.default.L_BRACE,
    '}': Tag_1.default.R_BRACE,
    '(': Tag_1.default.L_PARENTHESIS,
    ')': Tag_1.default.R_PARENTHESIS,
    '+': Tag_1.default.PLUS,
    '-': Tag_1.default.MINUS,
    '>': Tag_1.default.MORE,
    '<': Tag_1.default.LESS,
    '=': Tag_1.default.EQUAL,
    '>=': Tag_1.default.MORE_EQUAL,
    '<=': Tag_1.default.LESS_EQUAL,
    '==': Tag_1.default.LOOSE_EQUAL,
    '===': Tag_1.default.STRICT_EQUAL,
};
exports.default = SYMBOLS;
//# sourceMappingURL=Symbols.js.map