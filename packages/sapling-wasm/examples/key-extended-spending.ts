/**
 * Create an extended spending key from a mnemonic
 *
 * Call `npm run build` before running this example.
 */

import * as sapling from '@taquito/sapling-wasm'
import * as bip39 from 'bip39'

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

async function createExtendedSpendingKey(): Promise<Uint8Array> {
  const mnemonic: string = bip39.generateMnemonic()
  const password: string = ''
  const seed: Uint8Array = await bip39.mnemonicToSeed(mnemonic, password)
  const derivationPath = 'm/'

  // call `sapling#getExtendedSpendingKey` with a BIP39 seed and derivation path as arguments to create an extended spending key
  const spendingKey: Uint8Array = await sapling.getExtendedSpendingKey(seed, derivationPath)

  return spendingKey
}

createExtendedSpendingKey()
  .then((spendingKey: Uint8Array) => {
    console.log('spendingKey =', bytesToHex(spendingKey))
  })
  .catch((error) => {
    console.warn(error)
  })
