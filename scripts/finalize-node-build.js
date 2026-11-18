#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const pkgRoot = join(__dirname, '..', 'packages', 'sapling-wasm');
const distDir = join(pkgRoot, 'dist');
const pkgDir = join(pkgRoot, 'pkg');
const cjsSaplingPath = join(distDir, 'cjs', 'sapling.js');
const nodeEntryPath = join(distDir, 'index.node.js');
const pkgIndexPath = join(pkgDir, 'index.js');
const pkgWasmPath = join(pkgDir, 'index_bg.wasm');

const cjsSapling = readFileSync(cjsSaplingPath, 'utf8');
const cjsPkgRequirePattern = /require\(['"]\.\.\/pkg\/index\.js['"]\)/;
if (!cjsPkgRequirePattern.test(cjsSapling)) {
  throw new Error(`Expected require('../pkg/index.js') in ${cjsSaplingPath}`);
}
const patchedCjsSapling = cjsSapling.replace(cjsPkgRequirePattern, "require('../../pkg/index.js')");

writeFileSync(cjsSaplingPath, patchedCjsSapling);
writeFileSync(nodeEntryPath, "'use strict';\nmodule.exports = require('./cjs/index.js');\n");

const pkgIndex = readFileSync(pkgIndexPath, 'utf8');
const wasmReadLine = "const wasmBytes = require('fs').readFileSync(wasmPath);";
if (!pkgIndex.includes(wasmReadLine)) {
  throw new Error(`Expected "${wasmReadLine}" in ${pkgIndexPath}`);
}
const wasmBase64 = readFileSync(pkgWasmPath).toString('base64');
const patchedPkgIndex = pkgIndex.replace(
  wasmReadLine,
  `const wasmBytes = require('fs').existsSync(wasmPath) ? require('fs').readFileSync(wasmPath) : Uint8Array.from(atob('${wasmBase64}'), (c) => c.charCodeAt(0));`
);
writeFileSync(pkgIndexPath, patchedPkgIndex);
