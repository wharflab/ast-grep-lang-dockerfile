# ast-grep-lang-dockerfile

ast-grep language support for Dockerfile, using [tree-sitter-dockerfile](https://github.com/camdencheek/tree-sitter-dockerfile).

## Installation

```bash
npm install ast-grep-lang-dockerfile
# or
bun add ast-grep-lang-dockerfile
```

## Usage with CLI

Add to your `sgconfig.yml`:

```yaml
customLanguages:
  dockerfile:
    libraryPath: node_modules/ast-grep-lang-dockerfile/parser.so
    extensions: [Dockerfile, .dockerfile]
    languageSymbol: tree_sitter_dockerfile
    expandoChar: $
```

Then use ast-grep as usual:

```bash
sg run -l dockerfile -p 'FROM $IMG' .
```

## Usage with NAPI

```js
import dockerfile from 'ast-grep-lang-dockerfile'
import { registerDynamicLanguage, parse } from '@ast-grep/napi'

registerDynamicLanguage({ dockerfile })

const sg = parse('dockerfile', `FROM node:18
RUN npm install
CMD ["node", "app.js"]`)

console.log(sg.root().kind()) // source_file
```

## Building from source

If no prebuild is available for your platform, the package will attempt to build the parser from source during installation. This requires `tree-sitter-cli`:

```bash
npm install tree-sitter-cli --save-dev
```
