
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


const removeApostrophes = (data: string) => {
  return data.replace(/['"]/g, "");
}

interface TraverserNode extends ts.Node {
  traversorNodeId: string
}

const resolvePath = (data: string) => {
  if(data.startsWith('/')) {
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

  public addFileName(fileName: string) {
    this.fileName = resolvePath(fileName)
  }

  public addDependency(dependency: string): void {
    if (!this.dependencies.has(dependency)) {
      const module = new Module()
      //lets create another module in here
      this.dependencies.set(dependency, dependency)
    }
  }
}



const module = new Module();


const walk = (node: ts.Node): any => {
  let sourceFile = node as ts.SourceFile
  module.addAst(sourceFile)
  switch (node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      const importDecl = node as ts.ImportDeclaration
      const fName = importDecl.getSourceFile().fileName;
      console.log("fName is ", fName)
      module.addFileName(fName)
      module.addDependency(removeApostrophes(importDecl.moduleSpecifier.getText()))
  }
  ts.forEachChild(node, walk)
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


const bundle = (fileName: string) => {
  const ast = createSourceFileAst(fileName);
  const res = walk(ast);
  const queue = new Queue();
  queue.enqueue(module);
  while(!queue.empty()) {
    const module = queue.dequeue();
    if(module) {
      const dirname = path.dirname(module.fileName);
      
    }
  }
}




bundle(fileName)




