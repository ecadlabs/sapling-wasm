import { WasmSapling } from '../types'
import { bytesFrom } from '../utils'

export function __wasm__xsk(sapling: WasmSapling, seed: Uint8Array | string, derivationPath: string): Uint8Array {
  const seedBytes: Uint8Array = bytesFrom(seed, 'seed', '`Uint8Array` or hex string')

  return sapling.xsk(seedBytes, derivationPath)
}
