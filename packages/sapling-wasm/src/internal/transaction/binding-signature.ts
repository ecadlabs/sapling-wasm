import { WasmSapling } from '../types'
import { bytesFrom, stringFrom } from '../utils'

export function __wasm__bindingSignature(
  sapling: WasmSapling,
  context: number,
  valueBalance: string | number | bigint,
  sighash: Uint8Array | string
): Uint8Array {
  const valueBalanceString: string = stringFrom(valueBalance, 'valueBalance', '`number`, `bigint` or `string`')
  const sighashBytes: Uint8Array = bytesFrom(sighash, 'sighash', '`Uint8Array` or hex string')

  return sapling.bindingSignature(context, valueBalanceString, sighashBytes)
}
