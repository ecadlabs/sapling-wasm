/**
 * Create a proof authorizing key from an extended spending key
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

  const spendingKey: Uint8Array = await sapling.getExtendedSpendingKey(seed, derivationPath)
  // call `sapling#getProofAuthorizingKey` with an extended spending key as an argument to create a proof authorizing key
  const authorizingKey: Uint8Array = await sapling.getProofAuthorizingKey(spendingKey)

  return authorizingKey
}

createExtendedSpendingKey()
  .then((authorizingKey: Uint8Array) => {
    console.log('authorizingKey =', bytesToHex(authorizingKey))
  })
  .catch((error) => {
    console.warn(error)
  })
