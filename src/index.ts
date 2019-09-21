
import { readFileSync } from 'fs';
const path = require('path');
const babylon = require('babylon');
import * as ts from 'typescript';

let fileName = './sample/hello.ts';

class DependencyGraph {
  constructor() {

  }
}


const sourceFile = ts.createSourceFile(
  fileName,
  readFileSync(fileName).toString(),
  ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
);

const walk =  (node: ts.Node): any => {
  switch(node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      console.log("node is ", node)
  }
  ts.forEachChild(node, walk)
}

console.log('ast is ', walk(sourceFile))


