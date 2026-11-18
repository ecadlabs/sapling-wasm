import { WasmSapling } from '../types'
import { bytesFrom, numberFrom } from '../utils'

export function __wasm__merkleHashForDepth(
  sapling: WasmSapling,
  depth: string | number,
  lhs: Uint8Array | string,
  rhs: Uint8Array | string
): Uint8Array {
  const depthNum: number = numberFrom(depth)
  const lhsBytes: Uint8Array = bytesFrom(lhs)
  const rhsBytes: Uint8Array = bytesFrom(rhs)

  return sapling.merkleHash(depthNum, lhsBytes, rhsBytes)
}
