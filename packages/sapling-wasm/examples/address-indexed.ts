/**
 * For the provided viewing key get a payment address with the specified index if valid, or the first valid one otherwise
 *
 * Call `npm run build` before running this example.
 */

import * as sapling from '@taquito/sapling-wasm'
import { SaplingPaymentAddress } from '@taquito/sapling-wasm'
import * as bip39 from 'bip39'

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

async function createIndexedAddress(): Promise<SaplingPaymentAddress> {
  const mnemonic: string = bip39.generateMnemonic()
  const seed: Uint8Array = await bip39.mnemonicToSeed(mnemonic, '')
  const derivationPath: string = 'm/'

  const viewingKey: Uint8Array = await sapling.getExtendedFullViewingKey(seed, derivationPath)

  const index: Uint8Array | string | number = 1

  // call `sapling#getPaymentAddressFromViewingKey` with an extended full viewing key and a specified diversifier index
  // to get a payment address with this or the next valid index
  const address: SaplingPaymentAddress = await sapling.getPaymentAddressFromViewingKey(viewingKey, index)

  return address
}

createIndexedAddress()
  .then((address: SaplingPaymentAddress) => {
    console.log('address.index =', bytesToHex(address.index))
    console.log('address.raw =', bytesToHex(address.raw))
  })
  .catch((error) => {
    console.warn(error)
  })
