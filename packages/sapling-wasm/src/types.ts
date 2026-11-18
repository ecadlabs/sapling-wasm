/**
 * A payment address with its diversifier index.
 *
 * @typedef {Object} SaplingPaymentAddress
 * @property {Uint8Array} index An 11-byte diversifier index stored as a list of bytes in a little-endian (LE) format
 * @property {Uint8Array} raw A 43-byte raw address value
 */
export interface SaplingPaymentAddress {
  index: Uint8Array
  raw: Uint8Array
}

/**
 * A sapling Spend Description as described in section 4.4 of the protocol specification.
 *
 * @typedef {Object} SaplingSpendDescription
 * @property {Uint8Array} cv
 * @property {Uint8Array} rt
 * @property {Uint8Array} nf
 * @property {Uint8Array} rk
 * @property {Uint8Array} proof
 * @property {Uint8Array} spendAuthSig
 */
export interface SaplingSpendDescription {
  cv: Uint8Array
  rt: Uint8Array
  nf: Uint8Array
  rk: Uint8Array
  proof: Uint8Array
  spendAuthSig: Uint8Array
}

/**
 * An unsigned sapling Spend Description.
 *
 * @typedef {Object} SaplingUnsignedSpendDescription
 */
export type SaplingUnsignedSpendDescription = Omit<SaplingSpendDescription, 'spendAuthSig'>

/**
 * A sapling Output Description as described in section 4.5 of the protocol specification.
 *
 * @typedef {Object} SaplingOutputDescription
 * @property {Uint8Array} cv
 * @property {Uint8Array} cm
 * @property {Uint8Array} epk
 * @property {Uint8Array} cenc
 * @property {Uint8Array} cout
 * @property {Uint8Array} proof
 */
export interface SaplingOutputDescription {
  cv: Uint8Array
  cm: Uint8Array
  epk: Uint8Array
  cenc: Uint8Array
  cout: Uint8Array
  proof: Uint8Array
}

/**
 * A partial sapling Output Description
 *
 * @typedef {Object} SaplingPartialOutputDescription
 */
export type SaplingPartialOutputDescription = Omit<SaplingOutputDescription, 'epk' | 'cenc' | 'cout'>
