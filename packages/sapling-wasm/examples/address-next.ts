/**
 * For the provided extended full viewing key and index get the next valid address
 *
 * Call `npm run build` before running this example.
 */

import * as sapling from '@taquito/sapling-wasm'
import { SaplingPaymentAddress } from '@taquito/sapling-wasm'
import * as bip39 from 'bip39'

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

async function createNextPaymentAddress(): Promise<SaplingPaymentAddress> {
  const mnemonic: string = bip39.generateMnemonic()
  const seed: Uint8Array = await bip39.mnemonicToSeed(mnemonic, '')
  const derivationPath: string = 'm/'

  const viewingKey: Uint8Array = await sapling.getExtendedFullViewingKey(seed, derivationPath)
  const address: SaplingPaymentAddress = await sapling.getPaymentAddressFromViewingKey(viewingKey)

  // call `sapling#getNextPaymentAddressFromViewingKey` with an extended full viewing key and a specified index
  // to get a payment address with the next valid index
  const nextAddress: SaplingPaymentAddress = await sapling.getNextPaymentAddressFromViewingKey(viewingKey, address.index)

  return nextAddress
}

createNextPaymentAddress()
  .then((nextAddress: SaplingPaymentAddress) => {
    console.log('nextAddress.index =', bytesToHex(nextAddress.index))
    console.log('nextAddress.raw =', bytesToHex(nextAddress.raw))
  })
  .catch((error) => {
    console.warn(error)
  })
