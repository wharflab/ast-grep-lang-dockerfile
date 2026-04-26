const { setup } = require('@ast-grep/nursery')
const languageRegistration = require('./index')

setup({
  dirname: __dirname,
  name: 'dockerfile',
  treeSitterPackage: 'tree-sitter-containerfile',
  languageRegistration,
  testRunner: (parse) => {
    // add test here
  }
})
