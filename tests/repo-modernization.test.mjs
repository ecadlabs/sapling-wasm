import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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
  assert.equal(packageJson.module, 'dist/browser/index.js');
  assert.equal(packageJson.browser, 'dist/browser/index.js');
  assert.equal(packageJson.types, 'dist/index.d.ts');
});

test('published package exposes a native ESM browser entry and ships the wasm asset', () => {
  const packageJson = readJson('packages/sapling-wasm/package.json');

  assert.deepEqual(packageJson.files, ['dist', 'pkg', 'pkg-web', 'README.md']);
  assert.deepEqual(packageJson.exports['.'], {
    types: './dist/index.d.ts',
    browser: './dist/browser/index.js',
    node: './dist/index.node.js',
    import: './dist/browser/index.js',
    require: './dist/index.node.js',
    default: './dist/browser/index.js'
  });

  const browserEntry = readText('packages/sapling-wasm/dist/browser/index.js');

  assert.match(browserEntry, /^export \* from ['"]\.\.\/types['"];/m);
  assert.doesNotMatch(browserEntry, /\bmodule\.exports\b/);
  assert.doesNotMatch(browserEntry, /\brequire\(/);
  assert.doesNotMatch(browserEntry, /__webpack_require__/);

  assert.equal(existsSync(new URL('packages/sapling-wasm/pkg/index_bg.wasm', repoRoot)), true);
  assert.equal(existsSync(new URL('packages/sapling-wasm/pkg-web/index_bg.wasm', repoRoot)), true);
});

test('npm pack includes both wasm-pack payload directories', () => {
  const packOutput = execFileSync(
    'npm',
    ['pack', '--dry-run', '--json'],
    {
      cwd: new URL('packages/sapling-wasm/', repoRoot),
      encoding: 'utf8',
    }
  );
  const [{ files }] = JSON.parse(packOutput);
  const packedPaths = files.map(({ path }) => path);

  assert.match(packedPaths.join('\n'), /pkg\/index_bg\.wasm/);
  assert.match(packedPaths.join('\n'), /pkg-web\/index\.js/);
  assert.match(packedPaths.join('\n'), /pkg-web\/index_bg\.wasm/);
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
