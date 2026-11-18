import { WasmSapling } from '../types'
import { bytesFrom } from '../utils'

export function __wasm__xfvk(sapling: WasmSapling, seed: Uint8Array | string, derivationPath: string): Uint8Array {
  const seedBytes: Uint8Array = bytesFrom(seed, 'seed', '`Uint8Array` or hex string')

  return sapling.xfvk(seedBytes, derivationPath)
}

export function __wasm__xfvkFromXsk(sapling: WasmSapling, xsk: Uint8Array | string): Uint8Array {
  const xskBytes: Uint8Array = bytesFrom(xsk, 'spendingKey', '`Uint8Array` or hex string')

  return sapling.xfvkFromXsk(xskBytes)
}

export function __wasm__ovk(sapling: WasmSapling, xfvk: Uint8Array | string): Uint8Array {
  const xfvkBytes: Uint8Array = bytesFrom(xfvk, 'viewingKey', '`Uint8Array` or hex string')

  return sapling.ovkFromXfvk(xfvkBytes)
}

export function __wasm__ivk(sapling: WasmSapling, xfvk: Uint8Array | string): Uint8Array {
  const xfvkBytes: Uint8Array = bytesFrom(xfvk, 'viewingKey', '`Uint8Array` or hex string')

  return sapling.xfvkToIvk(xfvkBytes)
}
