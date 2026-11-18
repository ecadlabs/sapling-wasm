/**
 * For the provided extended full viewing key get the default payment address
 *
 * Call `npm run build` before running this example.
 */

import * as sapling from '@taquito/sapling-wasm'
import { SaplingPaymentAddress } from '@taquito/sapling-wasm'
import * as bip39 from 'bip39'

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

async function createAddress(): Promise<SaplingPaymentAddress> {
  const mnemonic: string = bip39.generateMnemonic()
  const seed: Uint8Array = await bip39.mnemonicToSeed(mnemonic, '')
  const derivationPath: string = 'm/'

  const viewingKey: Uint8Array = await sapling.getExtendedFullViewingKey(seed, derivationPath)

  // call `sapling#getPaymentAddressFromViewingKey` with an extended full viewing key as the only argument
  // to get its default payment address (first valid)
  const address: SaplingPaymentAddress = await sapling.getPaymentAddressFromViewingKey(viewingKey)

  return address
}

createAddress()
  .then((address: SaplingPaymentAddress) => {
    console.log('address.index =', bytesToHex(address.index))
    console.log('address.raw =', bytesToHex(address.raw))
  })
  .catch((error) => {
    console.warn(error)
  })
