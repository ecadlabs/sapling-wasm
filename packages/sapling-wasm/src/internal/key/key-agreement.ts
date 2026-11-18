import { WasmSapling } from '../types'
import { bytesFrom } from '../utils'

export function __wasm__keyAgreement(
  sapling: WasmSapling,
  p: Uint8Array | string,
  sk: Uint8Array | string
): Uint8Array {
  const pBytes: Uint8Array = bytesFrom(p, 'p', '`Uint8Array` or hex string')
  const skBytes: Uint8Array = bytesFrom(sk, 'sk', '`Uint8Array` or hex string')

  return sapling.keyAgreement(pBytes, skBytes)
}
