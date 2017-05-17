"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var FileContentsReader = (function () {
    function FileContentsReader(fileName) {
        this.streamIndex = 0;
        this.fileName = fileName;
        this.fileContents = fs.readFileSync('./test.txt');
    }
    FileContentsReader.prototype.peek = function () {
        if (this.streamIndex >= this.fileContents.length) {
            return null;
        }
        else {
            return this.fileContents[this.streamIndex++];
        }
    };
    return FileContentsReader;
}());
exports.FileContentsReader = FileContentsReader;
//# sourceMappingURL=FileContentsReader.js.map