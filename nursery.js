const { setup } = require('@ast-grep/nursery')
const languageRegistration = require('./index')

setup({
  dirname: __dirname,
  name: 'dockerfile',
  treeSitterPackage: 'tree-sitter-dockerfile',
  languageRegistration,
  testRunner: (parse) => {
    // add test here
  }
})
