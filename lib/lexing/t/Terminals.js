"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
    '<=': Tag_1.default.LESS_EQUAL
};
var TERMINALS = __assign({}, KEYWORDS, SYMBOLS);
exports.default = TERMINALS;
//# sourceMappingURL=Terminals.js.map