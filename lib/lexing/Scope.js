"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scope = (function () {
    function Scope(parent) {
        this.table = {};
        this.parent = parent;
    }
    Scope.prototype.get = function (key) {
        return this.table[key];
    };
    Scope.prototype.set = function (key, value) {
        this.table[key] = value;
    };
    return Scope;
}());
exports.default = Scope;
//# sourceMappingURL=Scope.js.map