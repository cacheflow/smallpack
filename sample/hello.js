"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var world_1 = require("./world");
var random_1 = require("./random");
var hello = function () { return "hello " + world_1.default() + " " + random_1.default(); };
exports.default = hello;
