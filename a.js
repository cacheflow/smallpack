 (function (modules) {
 	function require(id) {
 		const [fn, mapping] = modules[id];
		console.log('modules contain ', modules)
 		function localRequire(name) {
 			return require(mapping[name]);
 		}

 		const module = {
 			exports: {}
 		};

 		fn(localRequire, module, module.exports);
 		return module.exports;
 	}

 	require("d41d8cd98f00b204e9800998ecf8427e");
 })({
 	d41d8cd98f00b204e9800998ecf8427e: [
 		function (require, module, exports) {
 			"use strict";
 			Object.defineProperty(exports, "__esModule", {
 				value: true
 			});
 			var world_1 = require("./world");
 			var hello = function () {
 				return "hello " + world_1.default();
 			};
 			exports.default = hello;

 		},
 		{
 			"/Users/lexisalexander/Documents/projects/smallpack/sample/world.ts": "d41d8cd98f00b204e9800998ecf8427e"
 		},
 	],
 	d41d8cd98f00b204e9800998ecf8427e: [
 		function (require, module, exports) {
 			"use strict";
 			Object.defineProperty(exports, "__esModule", {
 				value: true
 			});
 			var world = function () {
 				return 'world';
 			};
 			exports.default = world;

 		},
 		{},
 	],
 })
