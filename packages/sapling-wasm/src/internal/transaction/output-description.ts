import { SaplingOutputDescription, SaplingPartialOutputDescription, SaplingPaymentAddress } from '../../types'

import { WasmSapling } from '../types'
import { isPaymentAddress } from '../address/payment-address'
import { bytesFrom, stringFrom } from '../utils'

export function __wasm__outputDescriptionFromXfvk(
  sapling: WasmSapling,
  context: number,
  xfvk: Uint8Array | string,
  to: SaplingPaymentAddress | Uint8Array | string,
  rcm: Uint8Array | string,
  value: string | number | bigint,
  memo?: Uint8Array | string
): SaplingOutputDescription {
  const xfvkBytes: Uint8Array = bytesFrom(xfvk, 'viewingKey', '`Uint8Array` or hex string')
  const toBytes: Uint8Array = bytesFrom(
    isPaymentAddress(to) ? to.raw : to,
    'destination',
    '`SaplingPaymentAddress`, `Uint8Array` or hex string'
  )
  const rcmBytes: Uint8Array = bytesFrom(rcm, 'rcm', '`Uint8Array` or hex string')
  const valueString: string = stringFrom(value, 'value', '`number`, `bigint` or `string`')
  const memoBytes: Uint8Array | undefined =
    memo !== undefined ? bytesFrom(memo, 'memo', '`Uint8Array` or hex string') : undefined

  const outputDescription: Uint8Array =
    memoBytes !== undefined
      ? sapling.outputDescriptionFromXfvkWithMemo(context, xfvkBytes, toBytes, rcmBytes, valueString, memoBytes)
      : sapling.outputDescriptionFromXfvk(context, xfvkBytes, toBytes, rcmBytes, valueString)

  return {
    cv: outputDescription.slice(0, 32) /* 32 bytes */,
    cm: outputDescription.slice(32, 64) /* 32 bytes */,
    epk: outputDescription.slice(64, 96) /* 32 bytes */,
    cenc: outputDescription.slice(96, 676) /* 580 bytes */,
    cout: outputDescription.slice(676, 756) /* 80 bytes */,
    proof: outputDescription.slice(756, 948) /* 48 + 96 + 48 bytes */
  }
}

export function __wasm__partialOutputDescription(
  sapling: WasmSapling,
  context: number,
  to: SaplingPaymentAddress | Uint8Array | string,
  rcm: Uint8Array | string,
  esk: Uint8Array | string,
  value: string | number | bigint
): SaplingPartialOutputDescription {
  const toBytes: Uint8Array = bytesFrom(
    isPaymentAddress(to) ? to.raw : to,
    'destination',
    '`SaplingPaymentAddress`, `Uint8Array` or hex string'
  )
  const rcmBytes: Uint8Array = bytesFrom(rcm, 'rcm', '`Uint8Array` or hex string')
  const eskBytes: Uint8Array = bytesFrom(esk, 'esk', '`Uint8Array` or hex string')
  const valueString: string = stringFrom(value, 'value', '`number`, `bigint` or `string`')

  const outputDescription: Uint8Array = sapling.partialOutputDescription(
    context,
    toBytes,
    rcmBytes,
    eskBytes,
    valueString
  )

  return {
    cv: outputDescription.slice(0, 32) /* 32 bytes */,
    cm: outputDescription.slice(32, 64) /* 32 bytes */,
    proof: outputDescription.slice(64, 256) /* 48 + 96 + 48 bytes */
  }
}

export function __wasm__deriveEpkFromEsk(
  sapling: WasmSapling,
  diversifier: Uint8Array | string,
  esk: Uint8Array | string
): Uint8Array {
  const diversifierBytes: Uint8Array = bytesFrom(diversifier, 'diversifier', '`Uint8Array` or hex string')
  const eskBytes: Uint8Array = bytesFrom(esk, 'esk', '`Uint8Array` or hex string')

  return sapling.deriveEpkFromEsk(diversifierBytes, eskBytes)
}
