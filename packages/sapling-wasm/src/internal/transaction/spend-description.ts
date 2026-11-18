import { SaplingPaymentAddress, SaplingSpendDescription, SaplingUnsignedSpendDescription } from '../../types'

import { WasmSapling } from '../types'
import { isPaymentAddress } from '../address/payment-address'
import { bytesFrom, concatBytes, stringFrom } from '../utils'

export function __wasm__spendDescriptionFromXsk(
  sapling: WasmSapling,
  context: number,
  xsk: Uint8Array | string,
  address: SaplingPaymentAddress | Uint8Array | string,
  rcm: Uint8Array | string,
  ar: Uint8Array | string,
  value: string | number | bigint,
  anchor: Uint8Array | string,
  merklePath: Uint8Array | string
): SaplingUnsignedSpendDescription {
  const xskBytes: Uint8Array = bytesFrom(xsk, 'spendingKey', '`Uint8Array` or hex string')
  const addressBytes: Uint8Array = bytesFrom(
    isPaymentAddress(address) ? address.raw : address,
    'address',
    '`SaplingPaymentAddress`, `Uint8Array` or hex string'
  )
  const rcmBytes: Uint8Array = bytesFrom(rcm, 'rcm', '`Uint8Array` or hex string')
  const arBytes: Uint8Array = bytesFrom(ar, 'ar', '`Uint8Array` or hex string')
  const valueString: string = stringFrom(value, 'value', '`number`, `bigint` or `string`')
  const anchorBytes: Uint8Array = bytesFrom(anchor, 'anchor', '`Uint8Array` or hex string')
  const merklePathBytes: Uint8Array = bytesFrom(merklePath, 'merklePath', '`Uint8Array` or hex string')

  const spendDescription: Uint8Array = sapling.spendDescriptionFromXsk(
    context,
    xskBytes,
    addressBytes,
    rcmBytes,
    arBytes,
    valueString,
    anchorBytes,
    merklePathBytes
  )

  return {
    cv: spendDescription.slice(0, 32) /* 32 bytes */,
    rt: spendDescription.slice(32, 64) /* 32 bytes */,
    nf: spendDescription.slice(64, 96) /* 32 bytes */,
    rk: spendDescription.slice(96, 128) /* 32 bytes */,
    proof: spendDescription.slice(128, 320) /* 48 + 96 + 48 bytes */
  }
}

export function __wasm__spendDescriptionFromPak(
  sapling: WasmSapling,
  context: number,
  pak: Uint8Array | string,
  address: SaplingPaymentAddress | Uint8Array | string,
  rcm: Uint8Array | string,
  ar: Uint8Array | string,
  value: string | number | bigint,
  anchor: Uint8Array | string,
  merklePath: Uint8Array | string
): SaplingUnsignedSpendDescription {
  const pakBytes: Uint8Array = bytesFrom(pak, 'authorizingKey', '`Uint8Array` or hex string')
  const addressBytes: Uint8Array = bytesFrom(
    isPaymentAddress(address) ? address.raw : address,
    'address',
    '`SaplingPaymentAddress`, `Uint8Array` or hex string'
  )
  const rcmBytes: Uint8Array = bytesFrom(rcm, 'rcm', '`Uint8Array` or hex string')
  const arBytes: Uint8Array = bytesFrom(ar, 'ar', '`Uint8Array` or hex string')
  const valueString: string = stringFrom(value, 'value', '`number`, `bigint` or `string`')
  const anchorBytes: Uint8Array = bytesFrom(anchor, 'anchor', '`Uint8Array` or hex string')
  const merklePathBytes: Uint8Array = bytesFrom(merklePath, 'merklePath', '`Uint8Array` or hex string')

  const spendDescription: Uint8Array = sapling.spendDescriptionFromPak(
    context,
    pakBytes,
    addressBytes,
    rcmBytes,
    arBytes,
    valueString,
    anchorBytes,
    merklePathBytes
  )

  return {
    cv: spendDescription.slice(0, 32) /* 32 bytes */,
    rt: spendDescription.slice(32, 64) /* 32 bytes */,
    nf: spendDescription.slice(64, 96) /* 32 bytes */,
    rk: spendDescription.slice(96, 128) /* 32 bytes */,
    proof: spendDescription.slice(128, 320) /* 48 + 96 + 48 bytes */
  }
}

export function __wasm__signSpendDescriptionWithXsk(
  sapling: WasmSapling,
  description: SaplingUnsignedSpendDescription,
  xsk: Uint8Array | string,
  ar: Uint8Array | string,
  sighash: Uint8Array | string
): SaplingSpendDescription {
  const descriptionBytes: Uint8Array = concatBytes([
    description.cv,
    description.rt,
    description.nf,
    description.rk,
    description.proof
  ])
  const xskBytes: Uint8Array = bytesFrom(xsk, 'spendingKey', '`Uint8Array` or hex string')
  const arBytes: Uint8Array = bytesFrom(ar, 'ar', '`Uint8Array` or hex string')
  const sighashBytes: Uint8Array = bytesFrom(sighash, 'sighash', '`Uint8Array` or hex string')

  const signedDescription: Uint8Array = sapling.signSpendDescriptionWithXsk(
    descriptionBytes,
    xskBytes,
    arBytes,
    sighashBytes
  )

  return {
    cv: signedDescription.slice(0, 32) /* 32 bytes */,
    rt: signedDescription.slice(32, 64) /* 32 bytes */,
    nf: signedDescription.slice(64, 96) /* 32 bytes */,
    rk: signedDescription.slice(96, 128) /* 32 bytes */,
    proof: signedDescription.slice(128, 320) /* 48 + 96 + 48 bytes */,
    spendAuthSig: signedDescription.slice(320, 384) /* 64 bytes */
  }
}
