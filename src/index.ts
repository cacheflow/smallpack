import { resolve } from "dns";

const path = require('path');
const fs = require('fs');
const babylon = require('babylon');

const bundle  = (filename: string) => {
  console.log(' process is ', process.cwd())
  // const resolvedPath = path.resolvedPath(filename)
  // console.log('resolvedPath is ', resolvedPath)
  // const fileContent = fs.readFileSync(filename, 'utf-8');

  // const ast = babylon.parse(fileContent, {
  //   sourceType: 'module',
  // })

  // console.log('ast is ', ast)
}

bundle('../sample/hello')