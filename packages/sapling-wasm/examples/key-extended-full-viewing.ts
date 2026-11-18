/**
 * Create an extended full viewing key from a mnemonic
 *
 * Call `npm run build` before running this example.
 */

import * as sapling from '@taquito/sapling-wasm'
import * as bip39 from 'bip39'

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

async function createExtendedFullViewingKey(): Promise<Uint8Array> {
  const mnemonic: string = bip39.generateMnemonic()
  const password: string = ''
  const seed: Uint8Array = await bip39.mnemonicToSeed(mnemonic, password)
  const derivationPath = 'm/'

  // call `sapling#getExtendedFullViewingKey` with a BIP39 seed and derivation path as arguments to create an extended full viewing key
  const viewingKey: Uint8Array = await sapling.getExtendedFullViewingKey(seed, derivationPath)

  return viewingKey
}

createExtendedFullViewingKey()
  .then((viewingKey: Uint8Array) => {
    console.log('viewingKey =', bytesToHex(viewingKey))
  })
  .catch((error) => {
    console.warn(error)
  })
