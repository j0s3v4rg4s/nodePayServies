"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index = express_1.Router();
index.get('/', function (req, res, nex) {
    res.send("Hola index 8");
});
exports.default = index;
//# sourceMappingURL=index.js.map