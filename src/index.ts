
import { readFileSync } from 'fs';
const path = require('path');
const babylon = require('babylon');
import * as ts from 'typescript';

let fileName = './sample/hello.ts';

interface AdjList {
  [key: string]: string[],
}

interface Ast extends ts.SourceFile {
  ast: string
}

  class DependencyGraph {

    adjList: AdjList = {}
    ast = {};

    constructor() {
      this.adjList = {}
      this.ast = {}
    }

    addParent(vertex: string): void {
      const { adjList  } = this;
      if( !(vertex in adjList)) {
        adjList[vertex] = [];
      }
    }

    addAst(ast: ts.SourceFile) {
      if(Object.keys(this.ast).length >= 1) {
        return;
      }
      this.ast = ast
      console.log('ast is ', this.ast)
    }

    addDependency(vertex: string, node: string): void {
      if(vertex in this.adjList) {
        if (!(node in this.adjList[vertex])) {
          this.adjList[vertex].push(node)
        }
        else {
          "Parent already exists."
        }
      }
      else {
        throw "Parent does not exist"
      }
    }

    print() {
      console.log('list is ', this.adjList)
    }
  }

  let g = new DependencyGraph();





const sourceFile = ts.createSourceFile(
  fileName,
  readFileSync(fileName).toString(),
  ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
);

const walk =  (node: ts.Node): any => {
  let sourceFile = node as ts.SourceFile
  g.addAst(sourceFile)
  switch(node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      const importDecl = node as ts.ImportDeclaration
      const sourceFile = node as ts.SourceFile;
      const fName = importDecl.getSourceFile().fileName;
      g.addParent(fName)
      g.addDependency(fName, importDecl.moduleSpecifier.getText().replace(/['"]/g, ''))
  }
  ts.forEachChild(node, walk)
}




console.log('walking ', walk(sourceFile))

console.log('graph is ', g.print())



