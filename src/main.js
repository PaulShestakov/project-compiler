"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileContentsReader_1 = require("./FileContentsReader");
var SYMBOLS;
(function (SYMBOLS) {
    SYMBOLS[SYMBOLS["L_BRACE"] = 0] = "L_BRACE";
    SYMBOLS[SYMBOLS["R_BRACE"] = 1] = "R_BRACE";
    SYMBOLS[SYMBOLS["L_PARENTHESIS"] = 2] = "L_PARENTHESIS";
    SYMBOLS[SYMBOLS["R_PARENTHESIS"] = 3] = "R_PARENTHESIS";
    SYMBOLS[SYMBOLS["PLUS"] = 4] = "PLUS";
    SYMBOLS[SYMBOLS["MINUS"] = 5] = "MINUS";
    SYMBOLS[SYMBOLS["LESS"] = 6] = "LESS";
    SYMBOLS[SYMBOLS["MORE"] = 7] = "MORE";
    SYMBOLS[SYMBOLS["EQUAL"] = 8] = "EQUAL";
})(SYMBOLS || (SYMBOLS = {}));
var KEYWORDS;
(function (KEYWORDS) {
    KEYWORDS[KEYWORDS["IF"] = 0] = "IF";
    KEYWORDS[KEYWORDS["ELSE"] = 1] = "ELSE";
    KEYWORDS[KEYWORDS["DO"] = 2] = "DO";
    KEYWORDS[KEYWORDS["WHILE"] = 3] = "WHILE";
})(KEYWORDS || (KEYWORDS = {}));
var SYMBOLS_MAP = {
    '{': SYMBOLS.L_BRACE,
    '}': SYMBOLS.R_BRACE,
    '(': SYMBOLS.L_PARENTHESIS,
    ')': SYMBOLS.R_PARENTHESIS,
    '+': SYMBOLS.PLUS,
    '-': SYMBOLS.MINUS,
    '<': SYMBOLS.LESS,
    '>': SYMBOLS.MORE,
    '=': SYMBOLS.EQUAL
};
var KEYWORDS_MAP = {
    'if': KEYWORDS.IF,
    'else': KEYWORDS.ELSE,
    'do': KEYWORDS.DO,
    'while': KEYWORDS.WHILE,
};
var file = new FileContentsReader_1.FileContentsReader('./test.txt');
function scan() {
    "use strict";
    // skip spaces
    // numbers
    // reserved letters and identificators
    // it's a token
}
