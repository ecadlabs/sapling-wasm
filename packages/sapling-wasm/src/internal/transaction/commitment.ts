import { WasmSapling } from '../types'
import { bytesFrom, equalsBytes, stringFrom } from '../utils'

export function __wasm__verifyCmu(
  sapling: WasmSapling,
  cmu: Uint8Array | string,
  address: Uint8Array | string,
  value: string | number | bigint,
  rcm: Uint8Array | string
): boolean {
  const cmuBytes: Uint8Array = bytesFrom(cmu, 'commitment', '`Uint8Array` or hex string')
  const addressBytes: Uint8Array = bytesFrom(address, 'address', '`Uint8Array` or hex string')
  const valueString: string = stringFrom(value, 'value', '`number`, `bigint` or `string`')
  const rcmBytes: Uint8Array = bytesFrom(rcm, 'rcm', '`Uint8Array` or hex string')

  const computedCmu: Uint8Array = sapling.computeCommitment(addressBytes, valueString, rcmBytes)

  return equalsBytes(cmuBytes, computedCmu)
}
