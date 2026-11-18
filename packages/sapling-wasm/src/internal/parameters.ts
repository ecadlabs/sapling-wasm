import { WasmSapling } from './types'
import { bytesFrom } from './utils'

export function __wasm__initParameters(
  sapling: WasmSapling,
  spendParams: Uint8Array | string,
  outputParams: Uint8Array | string
): void {
  const spendParamsBytes: Uint8Array = bytesFrom(spendParams, 'spendParams', '`Uint8Array` or hex string')
  const outputParamsBytes: Uint8Array = bytesFrom(outputParams, 'outputParams', '`Uint8Array` or hex string')

  sapling.initParams(spendParamsBytes, outputParamsBytes)
}
