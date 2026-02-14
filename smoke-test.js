#!/usr/bin/env node
const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const rootDir = __dirname

function run(cmd, options = {}) {
  console.log(`> ${cmd}`)
  return execSync(cmd, { cwd: rootDir, stdio: 'inherit', ...options })
}

console.log('=== Smoke Test ===\n')

// Test 1: Verify parser builds
console.log('1. Building parser...')
run('npm run build')

const parserPath = path.join(rootDir, 'parser.so')
if (!fs.existsSync(parserPath)) {
  console.error('✗ parser.so not found after build')
  process.exit(1)
}
console.log('✓ Parser built successfully\n')

// Test 2: Verify the module can be loaded and exports are correct
console.log('2. Verifying module exports...')
const langModule = require('./index')

if (!langModule.libraryPath) {
  console.error('✗ Missing libraryPath export')
  process.exit(1)
}

if (!fs.existsSync(langModule.libraryPath)) {
  console.error(`✗ libraryPath does not exist: ${langModule.libraryPath}`)
  process.exit(1)
}

if (langModule.languageSymbol !== 'tree_sitter_dockerfile') {
  console.error(`✗ Unexpected languageSymbol: ${langModule.languageSymbol}`)
  process.exit(1)
}

if (!Array.isArray(langModule.extensions) || langModule.extensions.length === 0) {
  console.error('✗ Missing or empty extensions export')
  process.exit(1)
}

console.log(`  libraryPath: ${langModule.libraryPath}`)
console.log(`  languageSymbol: ${langModule.languageSymbol}`)
console.log(`  extensions: ${langModule.extensions.join(', ')}`)
console.log('✓ Module exports are correct\n')

// Test 3: Verify ast-grep can load the custom language
console.log('3. Verifying ast-grep can load the custom language...')
try {
  run('npx ast-grep scan -c sgconfig.yml --json', { stdio: 'pipe' })
  console.log('✓ ast-grep loaded custom language successfully\n')
} catch (error) {
  console.error('✗ ast-grep failed to load custom language')
  process.exit(1)
}

console.log('=== All smoke tests passed ===')
