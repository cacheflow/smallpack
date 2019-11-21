const path = require('path');
const babylon = require('babylon');
import { readFileSync } from 'fs';
const md5 = require('md5');
import * as ts from 'typescript';
import { resolve } from 'path';
let fileName = './sample/hello.ts';

//include minifier
class Queue {

  data: Array<Module>

  constructor() {
    this.data = [];
  }

  enqueue = (record: any) => this.data.unshift(record);

  dequeue = (): Module | undefined => this.data.pop()

  size = () => this.data.length;

  first = () => this.data[0];

  last = () => this.data[this.data.length - 1];

  empty = () => this.data.length === 0;

}




interface Ast extends ts.SourceFile {
  ast: string
}


const removeApostrophes = (data: string) => {
  return data.replace(/['"]/g, "");
}

interface TraverserNode extends ts.Node {
  traversorNodeId: string
}

const resovledDependencyPath = (parentDir: string, depName: string) => {
  const depPath = removeApostrophes(depName)
  return path.resolve(parentDir, depPath)
}

const resolvePath = (data: string) => {
  if(data.startsWith('/') || data.startsWith('./')) {
    return path.join(path.dirname(data), data);
  }
  return data;
}


class Module {

  ast: object
  id: string
  code!: string
  fileName: string
  mapping: Record<string, string>
  dependencies: Record<any, any>

  constructor() {
    this.ast = {};
    this.fileName = ''
    this.mapping = {}
    this.code = ''
    this.dependencies = new Map()
    this.id = md5('')
  }


  public addAst(ast: ts.SourceFile) {
    if (Object.keys(this.ast).length >= 1) {
      return;
    }
    this.ast = ast
  }

  public addCode(code: string) {
    if (Object.keys(this.code).length >= 1) {
      return;
    }
    const transpiledCode = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS
      }
    })
    this.code = transpiledCode.outputText || '';
  }


  public addFileName(fileName: string) {
    this.fileName = resolvePath(fileName)
  }

  public addDependency(dependency: string): void {
    if (!this.dependencies.has(dependency)) {
      //lets create another module in here
      const prependedDep = dependency.includes('.ts') ? dependency : `${dependency}.ts` 
      this.dependencies.set(prependedDep, prependedDep)
    }
  }
}

const getDependencies = (node: ts.SourceFile, module: Module): Module => {
  recursivelyGetDepdencies(node)
  function recursivelyGetDepdencies(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration:
        const importDecl = node as ts.ImportDeclaration
        const depName = importDecl.moduleSpecifier.getText();
        const fileName = importDecl.getSourceFile().fileName;
        const parentDirName = path.dirname(fileName);
        module.addDependency(resovledDependencyPath(parentDirName, depName))
    }
    ts.forEachChild(node, recursivelyGetDepdencies)
  }
  
  return module
}



const walk = (node: ts.Node): Module => {
  const module = new Module;
  const sourceFile = node as ts.SourceFile;
  module.addAst(sourceFile)
  module.addFileName(sourceFile.fileName)
  module.addCode(sourceFile.text);
  console.log('fileName is ', sourceFile.fileName, module.id)
  const moduleWithDependencies = getDependencies(sourceFile, module)
  return moduleWithDependencies
}

const createSourceFileAst = (fileName: string) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );
  return sourceFile;
}

const buildModule = (fileName: string) => {
  const ast = createSourceFileAst(fileName);
  const module = walk(ast)
  return module;
}




const bundle = (fileName: string) => {
  const module = buildModule(fileName);
  const queue = new Queue();
  queue.enqueue(module);
  module.dependencies.forEach((depPath: string) => {
    const child = buildModule(depPath);
    module.mapping[depPath] = child.id
    queue.enqueue(child)
  })
  let modules = '';
  let initId = '';
  
  while(!queue.empty()) {
    const mod = queue.dequeue();
    if(mod) {
      if(!initId) {
        initId = mod.id;
      }

      modules += `${mod.id}: [
        function (require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)},
      ],`;
    }
  }

  // console.log('modules are ', modules)

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);
        return module.exports;
      }

      require("${initId}");
    })({${modules}})
  `;
  return result;
}




bundle(fileName)




