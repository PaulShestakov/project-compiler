"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var Tag_1 = require("./Tag");
var Number = (function (_super) {
    __extends(Number, _super);
    function Number(value) {
        var _this = _super.call(this, Tag_1.default.NUMBER) || this;
        _this.value = value;
        return _this;
    }
    Number.prototype.getValue = function () {
        return this.value;
    };
    return Number;
}(Token_1.default));
//# sourceMappingURL=Number.js.map