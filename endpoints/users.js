"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var users = [];
router.get("/", function (req, res) {
    res.json(users);
});
exports.default = router;
