"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path = require('path');
var babylon = require('babylon');
var ts = require("typescript");
var md5 = require('md5');
var fileName = './sample/hello.ts';
var Queue = /** @class */ (function () {
    function Queue() {
        var _this = this;
        this.enqueue = function (record) { return _this.data.unshift(record); };
        this.dequeue = function () { return _this.data.pop(); };
        this.size = function () { return _this.data.length; };
        this.first = function () { return _this.data[0]; };
        this.last = function () { return _this.data[_this.data.length - 1]; };
        this.empty = function () { return _this.data.length === 0; };
        this.data = [];
    }
    return Queue;
}());
var Module = /** @class */ (function () {
    function Module() {
        this.ast = {};
        this.fileName = '';
        this.code = '';
        this.dependencies = new Map();
        this.id = md5('');
    }
    Module.prototype.addAst = function (ast) {
        if (Object.keys(this.ast).length >= 1) {
            return;
        }
        this.ast = ast;
    };
    Module.prototype.addFileName = function (fileName) {
        this.fileName = fileName;
    };
    Module.prototype.addDependency = function (dependency) {
        if (!this.dependencies.has(dependency)) {
            this.dependencies.set(dependency, dependency);
        }
    };
    return Module;
}());
var module = new Module();
var createSourceFileAst = function (fileName) {
    var sourceFile = ts.createSourceFile(fileName, fs_1.readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, 
    /*setParentNodes */ true);
    return sourceFile;
};
var removeApostrophes = function (data) {
    return data.replace(/['"]/g, "");
};
var walk = function (node) {
    var sourceFile = node;
    module.addAst(sourceFile);
    switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
            var importDecl = node;
            var sourceFile_1 = node;
            var fName = importDecl.getSourceFile().fileName;
            module.addFileName(fName);
            module.addDependency(removeApostrophes(importDecl.moduleSpecifier.getText()));
    }
    ts.forEachChild(node, walk);
};
var bundle = function (module) {
    var queue = new Queue();
    queue.enqueue(module);
    var _loop_1 = function () {
        var data = queue.dequeue();
        var queuedModule = data;
        if (queuedModule) {
            var fileNameDir_1 = path.join(process.cwd(), path.dirname(queuedModule.fileName));
            queuedModule.dependencies.forEach(function (dep) {
                var depAbsolutePath = path.join(fileNameDir_1, dep + ".ts");
                var ast = createSourceFileAst(depAbsolutePath);
                console.log('ast is ', ast);
            });
        }
    };
    while (!queue.empty()) {
        _loop_1();
    }
};
walk(createSourceFileAst(fileName));
bundle(module);
