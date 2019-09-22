
import { readFileSync } from 'fs';
const path = require('path');
const babylon = require('babylon');
import * as ts from 'typescript';

let fileName = './sample/hello.ts';

class DependencyGraph {

  adjList: Map<any, Array<string>> = new Map();

  constructor() {
    this.adjList = new Map();
  }

  addVertex(vertex: string): void {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    } else {
      throw "Vertex already exists"
    }
  }

  addEdge(vertex: string, node: string): void {
    if(this.adjList.has(vertex)) {
      if(this.adjList.has(node)) {
        let arr = this.adjList.get(vertex)
        if(arr) {
          if (!arr.includes(node)) {
            arr.push(node)
          } else {
            throw `Can't add non-existing vertext -> ${node}`
          }
        }
      }
    }
  }

  print() {
    console.log('list is ', this.adjList)
  }
}

let g = new DependencyGraph();


g.print()


const sourceFile = ts.createSourceFile(
  fileName,
  readFileSync(fileName).toString(),
  ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
);

const walk =  (node: ts.Node): any => {
  switch(node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      console.log("node is ", node.parent)
  }
  ts.forEachChild(node, walk)
}

console.log('ast is ', walk(sourceFile))


