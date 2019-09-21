# Smallpack

A simple TypeScript module bundler, inspired by [minipack](https://github.com/ronami/minipack) and [bundler](https://github.com/jackpopp/bundler)

## Features

- [x] Minimal dependency (only [the TypeScript Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API))
- [x] Type check
- [x] Bundle TypeScript modules (only ECMAScript Modules)
- [x] Remove duplication for the same module
- [x] Resolve circular dependency
- [x] `node_modules` resolution

## Install

### Install globally with npm

```shell
npm install -g @cacheflow/Smallpack
```

Run with `Smallpack`.

### Manual install from source

```shell
git clone https://github.com/cacheflow/Smallpack.git
cd Smallpack
yarn # or `npm i` should work too
```

Run `bin/Smallpack` in the project root.

## How to use

```shell
Smallpack path/to/entry.ts
```

### Play with [examples](examples)

```shell
Smallpack examples/01-simple # stdout
Smallpack examples/01-simple | node # run
```

## How does it work?

Use [the code](src/Smallpack.ts), Luke!

## References

- [Minipack](https://github.com/ronami/minipack): A simplified example of a
  modern module bundler written in JavaScript
- [The TypeScript Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)

## License

[MIT](LICENSE)
