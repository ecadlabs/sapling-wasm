import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = new URL('../', import.meta.url);

function readJson(relativePath) {
  return JSON.parse(readFileSync(new URL(relativePath, repoRoot), 'utf8'));
}

function readText(relativePath) {
  return readFileSync(new URL(relativePath, repoRoot), 'utf8');
}

test('sapling-wasm keeps the current runtime export surface', () => {
  const saplingSource = readText('packages/sapling-wasm/src/sapling.ts');
  const exportedFunctions = [...saplingSource.matchAll(/^\s*export\s+async\s+function\s+(\w+)/gm)].map((match) => match[1]);

  assert.deepEqual(exportedFunctions, [
    'initParameters',
    'getExtendedSpendingKey',
    'getExtendedFullViewingKey',
    'getProofAuthorizingKey',
    'getExtendedFullViewingKeyFromSpendingKey',
    'getOutgoingViewingKey',
    'getIncomingViewingKey',
    'getPaymentAddressFromViewingKey',
    'getNextPaymentAddressFromViewingKey',
    'getRawPaymentAddressFromIncomingViewingKey',
    'getDiversifiedFromRawPaymentAddress',
    'getPkdFromRawPaymentAddress',
    'withProvingContext',
    'randR',
    'createBindingSignature',
    'prepareSpendDescriptionWithSpendingKey',
    'prepareSpendDescriptionWithAuthorizingKey',
    'signSpendDescription',
    'prepareOutputDescription',
    'preparePartialOutputDescription',
    'deriveEphemeralPublicKey',
    'verifyCommitment',
    'computeNullifier',
    'merkleHash',
    'keyAgreement'
  ]);

  const packageJson = readJson('packages/sapling-wasm/package.json');
  assert.equal(packageJson.name, '@taquito/sapling-wasm');
  assert.equal(packageJson.main, 'dist/index.node.js');
  assert.equal(packageJson.browser, 'dist/index.browser.js');
  assert.equal(packageJson.types, 'dist/index.d.ts');
});

test('repo uses a workspace-based JS toolchain and GitHub npm release flow', () => {
  const rootPackageJson = readJson('package.json');

  assert.deepEqual(rootPackageJson.workspaces, ['packages/sapling-wasm']);
  assert.match(rootPackageJson.scripts.build, /npm run -w @taquito\/sapling-wasm build/);
  assert.match(rootPackageJson.scripts.test, /npm run test:repo && npm run test:rust/);
  assert.match(rootPackageJson.scripts['test:repo'], /npm run build && node --test/);

  const ciWorkflow = readText('.github/workflows/main.yml');
  assert.match(ciWorkflow, /branches:\s*\n\s*-\s*main/);

  const releaseWorkflow = readText('.github/workflows/release.yml');
  assert.match(releaseWorkflow, /npm publish --workspaces --tag "\$\{DIST_TAG\}" --provenance --access public/);

  const rehearsalWorkflow = readText('.github/workflows/release_rehearsal.yml');
  assert.match(rehearsalWorkflow, /npm publish --workspaces --dry-run --tag "\$\{DIST_TAG\}" --access public/);
});

test('repo no longer carries mobile-wrapper packaging and release artifacts', () => {
  assert.equal(existsSync(new URL('packages/sapling-android', repoRoot)), false);
  assert.equal(existsSync(new URL('packages/sapling-ios', repoRoot)), false);
  assert.equal(existsSync(new URL('containers/android', repoRoot)), false);
  assert.equal(existsSync(new URL('Package.swift', repoRoot)), false);
  assert.equal(existsSync(new URL('jitpack.yml', repoRoot)), false);
  assert.equal(existsSync(new URL('.gitlab-ci.yml', repoRoot)), false);
});
