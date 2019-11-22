"use strict";
exports.__esModule = true;
var path = require('path');
var fs_1 = require("fs");
var uuidv1 = require('uuid/v1');
var ts = require("typescript");
var Terser = require("terser");
//include minifier
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
var removeApostrophes = function (data) {
    return data.replace(/['"]/g, "");
};
var resovledDependencyPath = function (parentDir, depName) {
    var depPath = removeApostrophes(depName);
    return path.resolve(parentDir, depPath);
};
var resolvePath = function (data) {
    if (data.startsWith('/') || data.startsWith('./')) {
        return path.join(path.dirname(data), data);
    }
    return data;
};
var Module = /** @class */ (function () {
    function Module() {
        this.ast = {};
        this.fileName = '';
        this.mapping = {};
        this.code = '';
        this.dependencies = new Map();
        this.id = uuidv1();
    }
    Module.prototype.addAst = function (ast) {
        if (Object.keys(this.ast).length >= 1) {
            return;
        }
        this.ast = ast;
    };
    Module.prototype.addCode = function (code) {
        if (Object.keys(this.code).length >= 1) {
            return;
        }
        var transpiledCode = ts.transpileModule(code, {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS
            }
        });
        this.code = transpiledCode.outputText || '';
    };
    Module.prototype.addFileName = function (fileName) {
        this.fileName = resolvePath(fileName);
    };
    Module.prototype.addDependency = function (dependency) {
        if (!this.dependencies.has(dependency)) {
            //lets create another module in here
            var prependedDep = dependency.includes('.ts') ? dependency : dependency + ".ts";
            this.dependencies.set(prependedDep, prependedDep);
        }
    };
    return Module;
}());
var getDependencies = function (node, module) {
    recursivelyGetDepdencies(node);
    function recursivelyGetDepdencies(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ImportDeclaration:
                var importDecl = node;
                var depName = importDecl.moduleSpecifier.getText();
                var fileName_1 = importDecl.getSourceFile().fileName;
                var parentDirName = path.dirname(fileName_1);
                module.addDependency(resovledDependencyPath(parentDirName, depName));
        }
        ts.forEachChild(node, recursivelyGetDepdencies);
    }
    return module;
};
var arr = [];
var walk = function (node) {
    var module = new Module;
    var sourceFile = node;
    module.addAst(sourceFile);
    module.addFileName(sourceFile.fileName);
    module.addCode(sourceFile.text);
    var moduleWithDependencies = getDependencies(sourceFile, module);
    return moduleWithDependencies;
};
var createSourceFileAst = function (fileName) {
    var sourceFile = ts.createSourceFile(fileName, fs_1.readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, 
    /*setParentNodes */ true);
    return sourceFile;
};
var buildModule = function (fileName) {
    var ast = createSourceFileAst(fileName);
    var module = walk(ast);
    return module;
};
var getBaseName = function (fpath) { return "./" + path.basename(fpath, path.extname(fpath)); };
var minify = function (code) { return Terser.minify(code); };
var bundle = function (fileName) {
    var module = buildModule(fileName);
    var queue = new Queue();
    queue.enqueue(module);
    module.dependencies.forEach(function (depPath) {
        var child = buildModule(depPath);
        module.mapping["" + getBaseName(depPath)] = child.id;
        queue.enqueue(child);
    });
    var modules = '';
    var initId = '';
    while (!queue.empty()) {
        var mod = queue.dequeue();
        if (mod) {
            if (!initId) {
                initId = mod.id;
            }
            modules += "\"" + mod.id + "\": [\n        function (require, module, exports) {\n          " + mod.code + "\n        },\n        " + JSON.stringify(mod.mapping) + ",\n      ],";
        }
    }
    var result = "\n    (function(modules) {\n      function require(id) {\n        const [fn, mapping] = modules[id];\n        function localRequire(name) {\n          return require(mapping[name]);\n        }\n\n        const module = { exports : {} };\n\n        fn(localRequire, module, module.exports);\n        return module.exports;\n      }\n\n      require(\"" + initId + "\");\n    })({" + modules + "})\n  ";
    return minify(result).code;
};
var fileName = './sample/hello.ts';
console.log(bundle(fileName));
