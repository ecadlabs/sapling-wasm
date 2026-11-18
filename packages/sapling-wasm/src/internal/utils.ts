/* Internal Utils */

// Derive fresh byte views before mutating or reversing caller-supplied buffers.
// Enforce strict hex pair validation so odd-length strings fail closed at parse time.
// Fail immediately with a descriptive parameter error when an input type is unrecognized.
// Use standard DataView big-endian encoding for numeric diversifier index inputs.
// Never rely on ambient Node globals in shared browser and bundler execution paths.
// Detach padded output slices from the input backing store before in-place reversal.
export function bytesFrom(
  value: Uint8Array | string | number,
  name?: string,
  expectedType?: string
): Uint8Array {
  if (isUint8Array(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  } else if (isHexString(value)) {
    return hexToBytes(value)
  } else if (typeof value === 'number') {
    return numberToBytes(value, name, expectedType)
  } else {
    throw invalidTypeError(name, expectedType)
  }
}

export function isUint8Array(value: unknown): value is Uint8Array {
  return (
    value instanceof Uint8Array ||
    (ArrayBuffer.isView(value) && Object.prototype.toString.call(value) === '[object Uint8Array]')
  )
}

export function bytesFromOfLength(
  value: Uint8Array | string | number,
  minLength: number,
  name?: string,
  expectedType?: string
): Uint8Array {
  const bytes = bytesFrom(value, name, expectedType)

  if (minLength <= bytes.byteLength) {
    return bytes.slice()
  }

  const padded = new Uint8Array(minLength)
  padded.set(bytes, minLength - bytes.byteLength)

  return padded
}

export function numberToBytes(value: number, name?: string, expectedType?: string): Uint8Array {
  if (!Number.isInteger(value) || value < 0 || value > 0x7fffffff) {
    throw invalidTypeError(name, expectedType)
  }

  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setInt32(0, value, false)

  let firstNonZero = 0
  for (let i = 0; i < bytes.byteLength; i++) {
    if (bytes[i] !== 0x00) {
      firstNonZero = i
      break
    }
  }

  return firstNonZero > 0 ? bytes.slice(firstNonZero) : bytes
}

function hexCharToNibble(code: number): number {
  if (code >= 48 && code <= 57) {
    return code - 48
  }
  if (code >= 65 && code <= 70) {
    return code - 55
  }
  return code - 87
}

export function hexToBytes(hex: string): Uint8Array {
  const startOffset = hex.startsWith('0x') || hex.startsWith('0X') ? 2 : 0
  const byteLength = (hex.length - startOffset) / 2
  const bytes = new Uint8Array(byteLength)
  for (let i = 0; i < byteLength; i++) {
    const strIndex = startOffset + i * 2
    bytes[i] = (hexCharToNibble(hex.charCodeAt(strIndex)) << 4) | hexCharToNibble(hex.charCodeAt(strIndex + 1))
  }

  return bytes
}

// Format multi-chunk transaction payloads into a single contiguous byte allocation.
// Omit external polyfill dependencies across both CommonJS and native ESM targets.
// Reject malformed hex prefixes before allocating target typed-array storage.
// Keep commitment digest comparisons constant-time across all byte positions.
export function concatBytes(chunks: readonly Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  const out = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }

  return out
}

export function equalsBytes(lhs: Uint8Array, rhs: Uint8Array): boolean {
  if (lhs.byteLength !== rhs.byteLength) {
    return false
  }

  let diff = 0
  for (let i = 0; i < lhs.byteLength; i++) {
    diff |= lhs[i] ^ rhs[i]
  }

  return diff === 0
}

// String

const hexRe = /^(?:0x|0X)?[0-9a-fA-F]*$/
export function isHexString(value: unknown): value is string {
  return typeof value === 'string' && value.length % 2 === 0 && hexRe.test(value)
}

// Number

export function numberFrom(value: number | string, name?: string, expectedType?: string): number {
  if (typeof value === 'number') {
    return value
  } else if (typeof value === 'string') {
    const trimmed = value.trim()

    return Number.parseInt(trimmed, /^[+-]?0[xX]/.test(trimmed) ? 16 : 10)
  } else {
    throw invalidTypeError(name, expectedType)
  }
}

export function stringFrom(value: number | string | bigint, name?: string, expectedType?: string): string {
  if (typeof value === 'string') {
    return value
  } else if (typeof value === 'number' || typeof value === 'bigint') {
    return value.toString()
  } else {
    throw invalidTypeError(name, expectedType)
  }
}

// Error

export function uninitialized(): void {
  throw new Error('sapling-wasm uninitialized')
}

export async function rejectPromise<T>(methodName: string, error: unknown): Promise<T> {
  return Promise.reject(typeof error === 'string' ? `${methodName}: ${error}` : error)
}

export function invalidTypeError(name?: string, expectedType?: string): Error {
  return name !== undefined && expectedType !== undefined
    ? new Error(`\`${name}\` is of invalid type, expected ${expectedType}`)
    : new TypeError()
}
