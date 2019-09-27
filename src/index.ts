
import { readFileSync } from 'fs';
const path = require('path');
const babylon = require('babylon');
import * as ts from 'typescript';
const md5 = require('md5');

let fileName = './sample/hello.ts';


class Queue {

  data: Array<[]>

  constructor() {
    this.data = [];
  }

  enqueue = (record: any) => this.data.unshift(record);

  dequeue = () => {
    if(this.data.length >= 1) {
      return this.data.pop()
    }
    throw new Error('Nothing to dequeue')
  }

  size = () => this.data.length;

  first = () => this.data[0];

  last = () => this.data[this.data.length - 1];

  empty = () => this.data.length === 0;

}



interface D {
  [key: string]: string[],
}

interface Ast extends ts.SourceFile {
  ast: string
}

  class Module {

    ast: object = {}
    id: string = ''
    code!: string
    fileName: string
    dependencies: Record<any, any>

    constructor() {
      this.ast = {};
      this.fileName = '';
      this.code = '';
      this.dependencies = new Map();
      this.id = md5('');
    }


    public addAst(ast: ts.SourceFile) {
      if(Object.keys(this.ast).length >= 1) {
        return;
      }
      this.ast = ast
    }

    public addFileName(fileName: string) {
      this.fileName = fileName;
    }

    public addDependency(dependency: string): void {
     if(!this.dependencies.has(dependency))  {
        this.dependencies.set(dependency, dependency)
     }
    }
  }

let module = new Module();


const createSourceFileAst = (fileName: string) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );
  return sourceFile;
}




const walk =  (node: ts.Node): any => {
  let sourceFile = node as ts.SourceFile
  module.addAst(sourceFile)
  switch(node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      const importDecl = node as ts.ImportDeclaration
      const sourceFile = node as ts.SourceFile;
      const fName = importDecl.getSourceFile().fileName;
      module.addFileName(fName)
      module.addDependency(importDecl.moduleSpecifier.getText().replace(/['"]/g, ''))
  }
  ts.forEachChild(node, walk)
}



const bundle = (module) => {
  const queue = new Queue();
  queue.enqueue(module);

  while(!queue.empty) {

  }
}




walk(createSourceFileAst(fileName))

console.log('graph is ', module)



