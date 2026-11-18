import { SaplingPaymentAddress } from '../../types'
import { WasmSapling } from '../types'

import { bytesFrom, bytesFromOfLength, isUint8Array } from '../utils'

export function getAddressFromXfvk(
  sapling: WasmSapling,
  xfvk: Uint8Array | string,
  index: Uint8Array | string | number | undefined
): SaplingPaymentAddress {
  const xfvkBytes: Uint8Array = bytesFrom(xfvk, 'viewingKey', '`Uint8Array` or hex string')
  const indexBytes: Uint8Array | undefined =
    index !== undefined
      ? bytesFromOfLength(index, 11, 'index', '`Uint8Array` or hex string').reverse() // LE
      : undefined

  const address: Uint8Array =
    indexBytes !== undefined
      ? sapling.paymentAddressFromXfvk(xfvkBytes, indexBytes)
      : sapling.defaultPaymentAddressFromXfvk(xfvkBytes)

  return {
    index: address.slice(0, 11),
    raw: address.slice(11)
  }
}

export function getNextAddressFromXfvk(
  sapling: WasmSapling,
  xfvk: Uint8Array | string,
  index: Uint8Array | string | number
): SaplingPaymentAddress {
  const xfvkBytes: Uint8Array = bytesFrom(xfvk, 'viewingKey', '`Uint8Array` or hex string')
  const indexBytes: Uint8Array = bytesFromOfLength(index, 11, 'index', '`Uint8Array` or hex string').reverse() // LE

  const address: Uint8Array = sapling.nextPaymentAddressFromXfvk(xfvkBytes, indexBytes)

  return {
    index: address.slice(0, 11),
    raw: address.slice(11)
  }
}

export function isPaymentAddress(address: unknown): address is SaplingPaymentAddress {
  return (
    typeof address === 'object' &&
    address !== null &&
    'index' in address &&
    isUint8Array(address.index) &&
    'raw' in address &&
    isUint8Array(address.raw)
  )
}

export function getRawAddressFromIvk(
  sapling: WasmSapling,
  ivk: Uint8Array | string,
  diversifier: Uint8Array | string
): Uint8Array {
  const ivkBytes: Uint8Array = bytesFrom(ivk, 'ivk', '`Uint8Array` or hex string')
  const diversifierBytes: Uint8Array = bytesFrom(diversifier, 'diversifier', '`Uint8Array` or hex string')

  return sapling.paymentAddressFromIvk(ivkBytes, diversifierBytes)
}

export function getDiversifierFromRawAddress(sapling: WasmSapling, address: Uint8Array | string): Uint8Array {
  const addressBytes: Uint8Array = bytesFrom(address, 'address', '`Uint8Array` or hex string')

  return sapling.diversifierFromPaymentAddress(addressBytes)
}

export function getPkdFromRawAddress(sapling: WasmSapling, address: Uint8Array | string): Uint8Array {
  const addressBytes: Uint8Array = bytesFrom(address, 'address', '`Uint8Array` or hex string')

  return sapling.pkdFromPaymentAddress(addressBytes)
}
