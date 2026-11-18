#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const version = args.find((arg) => !arg.startsWith('--'));

const repoRoot = join(__dirname, '..');
const rootPackagePath = join(repoRoot, 'package.json');
const packageLockPath = join(repoRoot, 'package-lock.json');
const workspacePackagePath = join(repoRoot, 'packages', 'sapling-wasm', 'package.json');
const cargoTomlPath = join(repoRoot, 'packages', 'sapling', 'Cargo.toml');
const cargoLockPath = join(repoRoot, 'Cargo.lock');

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

function readCargoLockVersion(content) {
  const match = content.match(/name = "airgap_sapling"\r?\nversion = "([^"]+)"/m);

  if (!match) {
    throw new Error('Could not find airgap_sapling version in Cargo.lock');
  }

  return match[1];
}

function replaceCargoLockVersion(content, nextVersion) {
  return content.replace(
    /(name = "airgap_sapling"\r?\nversion = ")([^"]+)(")/m,
    `$1${nextVersion}$3`
  );
}

const rootPackage = readJson(rootPackagePath);
const packageLock = readJson(packageLockPath);
const workspacePackage = readJson(workspacePackagePath);
const cargoToml = readFileSync(cargoTomlPath, 'utf8');
const cargoLock = readFileSync(cargoLockPath, 'utf8');
const cargoVersion = readCargoVersion(cargoToml);
const cargoLockVersion = readCargoLockVersion(cargoLock);

if (checkOnly) {
  const lockRootVersion = packageLock.packages?.['']?.version;
  const lockWorkspaceVersion = packageLock.packages?.['packages/sapling-wasm']?.version;
  const versions = [
    rootPackage.version,
    workspacePackage.version,
    cargoVersion,
    cargoLockVersion,
    packageLock.version,
    lockRootVersion,
    lockWorkspaceVersion
  ];
  const allMatch = versions.every((entry) => entry === versions[0]);

  if (!allMatch) {
    console.error(
      `Version mismatch: root=${rootPackage.version}, wasm=${workspacePackage.version}, cargo=${cargoVersion}, cargoLock=${cargoLockVersion}, lock=${packageLock.version}`
    );
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
packageLock.version = version;
if (packageLock.packages?.['']) {
  packageLock.packages[''].version = version;
}
if (packageLock.packages?.['packages/sapling-wasm']) {
  packageLock.packages['packages/sapling-wasm'].version = version;
}

writeJson(rootPackagePath, rootPackage);
writeJson(packageLockPath, packageLock);
writeJson(workspacePackagePath, workspacePackage);
writeFileSync(cargoTomlPath, replaceCargoVersion(cargoToml, version));
writeFileSync(cargoLockPath, replaceCargoLockVersion(cargoLock, version));

console.log(`Synchronized versions to ${version}`);
