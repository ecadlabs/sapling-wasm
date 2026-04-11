# Sapling Wasm

[![npm](https://img.shields.io/npm/v/@taquito/sapling-wasm.svg?colorB=brightgreen)](https://www.npmjs.com/package/@taquito/sapling-wasm)

Sapling Wasm bindings around [Zcash Rust crates](https://github.com/zcash/librustzcash), maintained in the Taquito npm namespace from the ECAD-managed fork of [airgap-it/airgap-sapling](https://github.com/airgap-it/airgap-sapling).

## Project Overview

The project is divided into the following packages:
- `sapling` - common sources in Rust, provides the Wasm bindings for [Zcash crates](https://github.com/zcash/librustzcash)
- `sapling-wasm` - a JavaScript library using Wasm bindings from the `sapling` package

The published npm package is `@taquito/sapling-wasm`. Repository ownership and maintenance live in the ECAD-managed fork at `ecadlabs/sapling-wasm`.

This repository was forked from the work of the AirGap team. We are grateful to the people behind `airgap-it/airgap-sapling` for the original implementation and foundation.

Stable releases are published from GitHub Actions with npm provenance enabled. The bootstrap prerelease `0.1.0-alpha.0` was created manually so the package could be registered and connected to npm trusted publishing.

The repository is distributed under the MIT license. See [LICENSE](./LICENSE).

## Sapling Wasm

### Install

To add the JavaScript Sapling library into your project:

```bash
npm install --save @taquito/sapling-wasm
```

### Examples

```ts
import * as bip39 from 'bip39'
import * as sapling from '@taquito/sapling-wasm'
import { SaplingPaymentAddress } from '@taquito/sapling-wasm'

const mnemonic: string = bip39.generateMnemonic()
const seed: Buffer = await bip39.mnemonicToSeed(mnemonic, '')
const derivationPath: string = 'm/'

// create an extended spending key
const spendingKey: Buffer = await sapling.getExtendedSpendingKey(seed, derivationPath)
console.log('spendingKey =', spendingKey.toString('hex'))

// create an extended full viewing key
const viewingKey: Buffer = await sapling.getExtendedFullViewingKey(seed, derivationPath)
console.log('viewingKey =', viewingKey.toString('hex'))

// get default address
const address: SaplingPaymentAddress = await sapling.getPaymentAddressFromViewingKey(viewingKey)
console.log(
  'address.index =', address.index.toString('hex'),
  'address.raw =', address.raw.toString('hex')
)
```

More advanced examples can be found in `js/examples`.

## Development

```bash
npm ci
npm run build
npm test
```

Release rehearsal and publish flows live in `.github/workflows/` and mirror the Taquito npm provenance pattern.
