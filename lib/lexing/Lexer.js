"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var Keywords_1 = require("./util/Keywords");
var Symbols_1 = require("./util/Symbols");
var Tag_1 = require("./util/Tag");
var Token_1 = require("./util/Token");
var Lexer = (function () {
    function Lexer(fileName) {
        this.characterIndex = -1;
        this.currentCharacter = null;
        this.fileContents = fs.readFileSync(fileName, 'utf8');
    }
    Lexer.prototype.peek = function () {
        this.skipAndPeek(0);
    };
    Lexer.prototype.skipAndPeek = function (skipLength) {
        if (this.characterIndex + 1 + skipLength > this.fileContents.length - 1) {
            this.currentCharacter = null;
        }
        else {
            this.currentCharacter = this.fileContents[this.characterIndex + 1 + skipLength];
            this.characterIndex += 1;
        }
    };
    Lexer.prototype.preview = function (length) {
        if (this.characterIndex + 1 > this.fileContents.length - 1) {
            return null;
        }
        else {
            return this.fileContents.substr(this.characterIndex + 1, length);
        }
    };
    Lexer.prototype.nextToken = function () {
        var token = null;
        this.peek();
        while (!token) {
            if (this.currentCharacter === null) {
                token = new Token_1.default(Tag_1.default.EOF);
            }
            else if (Lexer.isLineEnding(this.currentCharacter)) {
                this.peek();
            }
            else if (Lexer.isWhiteSpace(this.currentCharacter)) {
                this.peek();
            }
            else if (Symbols_1.default[this.currentCharacter + this.preview(1)]) {
                token = new Token_1.default(Symbols_1.default[this.currentCharacter + this.preview(1)]);
            }
            else if (Symbols_1.default[this.currentCharacter]) {
                token = new Token_1.default(Symbols_1.default[this.currentCharacter]);
            }
            else if (Lexer.isDigit(this.currentCharacter)) {
                var value = 0;
                while (Lexer.isDigit(this.currentCharacter)) {
                    value = value * 10 + parseInt(this.currentCharacter, 10);
                    this.peek();
                }
                token = new Token_1.default(Tag_1.default.NUMBER, value);
            }
            else if (Lexer.isLetter(this.currentCharacter)) {
                var word = '';
                while (Lexer.isLetter(this.currentCharacter)) {
                    word += this.currentCharacter;
                    this.peek();
                }
                if (Keywords_1.default[word]) {
                    token = new Token_1.default(Keywords_1.default[word]);
                }
                else {
                    token = new Token_1.default(Tag_1.default.ID, word);
                }
            }
            else {
                throw new Error("Unsupported character: '" + this.currentCharacter + "'");
            }
        }
        return token;
    };
    Lexer.isWhiteSpace = function (character) {
        var charCode = character.charCodeAt(0);
        // tab code is 9
        // space code is 32
        return charCode === 9 || charCode === 32;
    };
    Lexer.isLineEnding = function (character) {
        var charCode = character.charCodeAt(0);
        return charCode === 10;
    };
    Lexer.isDigit = function (character) {
        if (character === null) {
            return false;
        }
        var charCode = character.charCodeAt(0);
        return (charCode >= 48 && charCode <= 57); // 0-9
    };
    Lexer.isLetter = function (character) {
        if (character === null) {
            return false;
        }
        return character.match(/[a-z]/i);
    };
    Lexer.getTokens = function (fileName) {
    };
    return Lexer;
}());
exports.default = Lexer;
//# sourceMappingURL=Lexer.js.map