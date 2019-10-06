
import { readFileSync } from 'fs';
const path = require('path');
const babylon = require('babylon');
import * as ts from 'typescript';
const md5 = require('md5');

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

  public addFileName(fileName: string) {
    this.fileName = fileName;
  }

  public addDependency(dependency: string): void {
    if (!this.dependencies.has(dependency)) {
      this.dependencies.set(dependency, dependency)
    }
  }
}

let module = new Module();


class Transformer {

  fileName: string
  ast: object

  constructor(fileName: string) {
    this.fileName = "";
    this.ast = {};
  }

  createAst() {
    const { fileName } = this;
    const ast = ts.createSourceFile(
      fileName,
      readFileSync(fileName).toString(),
      ts.ScriptTarget.ES2015,
      /*setParentNodes */ true
    )
    this.ast = ast;
  }

  getAst() {
    if(this.ast) {
      return this.ast;
    }
    throw new Error("No AST to be found.")
  }
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

const removeApostrophes = (data: string) => {
  return data.replace(/['"]/g, "");
}

interface TraverserNode extends ts.Node {
  traversorNodeId: string
}





const walk = (node: ts.Node): any => {
  let sourceFile = node as ts.SourceFile
  module.addAst(sourceFile)
  switch (node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      const importDecl = node as ts.ImportDeclaration
      const sourceFile = node as ts.SourceFile;
      const fName = importDecl.getSourceFile().fileName;
      module.addFileName(fName)
      module.addDependency(removeApostrophes(importDecl.moduleSpecifier.getText()))
  }
  ts.forEachChild(node, walk)
}



const bundle = (module: Module) => {
  const queue = new Queue();
  queue.enqueue(module);

  while (!queue.empty()) {
    const data = queue.dequeue();
    const queuedModule = data;
    if (queuedModule) {
      const fileNameDir = path.join(process.cwd(), path.dirname(queuedModule.fileName))
      queuedModule.dependencies.forEach((dep: Module) => {
        const depAbsolutePath = path.join(fileNameDir, `${dep}.ts`)
        const child = createSourceFileAst(depAbsolutePath);
        console.log("child is now ", child)
      })
    }
  }
}

// class Transformer {

//   fileName: string
//   ast: object

//   constructor(fileName: string) {
//     this.fileName = "";
//     this.ast = {};
//   }

//   createAst() {
//     const { fileName } = this;
//     const ast = ts.createSourceFile(
//       fileName,
//       readFileSync(fileName).toString(),
//       ts.ScriptTarget.ES2015,
//       /*setParentNodes */ true
//     )
//     this.ast = ast;
//   }

//   getAst() {
//     if (this.ast) {
//       return this.ast;
//     }
//     throw new Error("No AST to be found.")
//   }
// }


// class Traverser {
//   readonly node: ts.Node
//   readonly module: Module

//   constructor(
//     node: ts.Node,
//     module: Module
//   ) {
//     this.node = node
//     this.module = module
//   }

//   walk(node: ts.Node): void {
//     let sourceFile = node as ts.SourceFile
//     module.addAst(sourceFile)
//     switch (node.kind) {
//       case ts.SyntaxKind.ImportDeclaration:
//         const importDecl = node as ts.ImportDeclaration
//         const sourceFile = node as ts.SourceFile;
//         const fName = importDecl.getSourceFile().fileName;
//         module.addFileName(fName)
//         module.addDependency(removeApostrophes(importDecl.moduleSpecifier.getText()))
//     }
//     ts.forEachChild(node, walk)
//   }
// }

// const walk = (node: ts.Node): any => {
//   let sourceFile = node as ts.SourceFile
//   module.addAst(sourceFile)
//   switch (node.kind) {
//     case ts.SyntaxKind.ImportDeclaration:
//       const importDecl = node as ts.ImportDeclaration
//       const sourceFile = node as ts.SourceFile;
//       const fName = importDecl.getSourceFile().fileName;
//       module.addFileName(fName)
//       module.addDependency(removeApostrophes(importDecl.moduleSpecifier.getText()))
//   }
//   ts.forEachChild(node, walk)
// }





walk(createSourceFileAst(fileName))


bundle(module)




