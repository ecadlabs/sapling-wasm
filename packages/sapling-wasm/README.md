# Sapling Wasm

[![npm](https://img.shields.io/npm/v/@taquito/sapling-wasm.svg?colorB=brightgreen)](https://www.npmjs.com/package/@taquito/sapling-wasm)

A Wasm wrapper around [Zcash Rust crates](https://github.com/zcash/librustzcash), published as part of the Taquito package namespace.

The published package name is `@taquito/sapling-wasm`.

## Install

To add the JavaScript Sapling library into your project:

```bash
npm install --save @taquito/sapling-wasm
```

## Examples

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

More advanced examples can be found in `./examples`.

## Development

```bash
npm run build
```
