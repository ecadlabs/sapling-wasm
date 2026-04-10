#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const version = args.find((arg) => !arg.startsWith('--'));

const repoRoot = join(__dirname, '..');
const rootPackagePath = join(repoRoot, 'package.json');
const workspacePackagePath = join(repoRoot, 'packages', 'sapling-wasm', 'package.json');
const cargoTomlPath = join(repoRoot, 'packages', 'sapling', 'Cargo.toml');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

function readCargoVersion(content) {
  const match = content.match(/^version = "([^"]+)"$/m);

  if (!match) {
    throw new Error('Could not find Cargo package version');
  }

  return match[1];
}

function replaceCargoVersion(content, nextVersion) {
  return content.replace(/^version = "([^"]+)"$/m, `version = "${nextVersion}"`);
}

const rootPackage = readJson(rootPackagePath);
const workspacePackage = readJson(workspacePackagePath);
const cargoToml = readFileSync(cargoTomlPath, 'utf8');
const cargoVersion = readCargoVersion(cargoToml);

if (checkOnly) {
  const versions = [rootPackage.version, workspacePackage.version, cargoVersion];
  const allMatch = versions.every((entry) => entry === versions[0]);

  if (!allMatch) {
    console.error(`Version mismatch: root=${rootPackage.version}, wasm=${workspacePackage.version}, cargo=${cargoVersion}`);
    process.exit(1);
  }

  console.log(`Versions match at ${versions[0]}`);
  process.exit(0);
}

if (!version) {
  console.error('Usage: node scripts/sync-workspace-version.js <version> | --check');
  process.exit(1);
}

rootPackage.version = version;
workspacePackage.version = version;

writeJson(rootPackagePath, rootPackage);
writeJson(workspacePackagePath, workspacePackage);
writeFileSync(cargoTomlPath, replaceCargoVersion(cargoToml, version));

console.log(`Synchronized versions to ${version}`);
