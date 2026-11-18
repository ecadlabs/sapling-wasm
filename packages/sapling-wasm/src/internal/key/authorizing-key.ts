import { WasmSapling } from '../types'
import { bytesFrom } from '../utils'

export function __wasm__pak_from_xsk(sapling: WasmSapling, xsk: Uint8Array | string): Uint8Array {
  const xskBytes: Uint8Array = bytesFrom(xsk, 'spendingKey', '`Uint8Array` or hex string')

  return sapling.pakFromXsk(xskBytes)
}
