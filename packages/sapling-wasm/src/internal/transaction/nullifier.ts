import { WasmSapling } from '../types'
import { bytesFrom, stringFrom } from '../utils'

export function __wasm__computeNf(
  sapling: WasmSapling,
  xfvk: Uint8Array | string,
  address: Uint8Array | string,
  value: string | number | bigint,
  rcm: Uint8Array | string,
  position: string | number | bigint
): Uint8Array {
  const xfvkBytes: Uint8Array = bytesFrom(xfvk, 'viewingKey', '`Uint8Array` or hex string')
  const addressBytes: Uint8Array = bytesFrom(address, 'address', '`Uint8Array` or hex string')
  const valueString: string = stringFrom(value, 'value', '`number`, `bigint` or `string`')
  const rcmBytes: Uint8Array = bytesFrom(rcm, 'rcm', '`Uint8Array` or hex string')
  const positionString: string = stringFrom(position, 'position', '`number`, `bigint` or `string`')

  return sapling.computeNullifier(xfvkBytes, addressBytes, valueString, rcmBytes, positionString)
}
