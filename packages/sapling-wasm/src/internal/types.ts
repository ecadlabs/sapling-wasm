export interface WasmSapling {
  initParams(spendParams: Uint8Array, outputParams: Uint8Array): void
  xsk(seed: Uint8Array, derivationPath: string): Uint8Array
  xfvk(seed: Uint8Array, derivationPath: string): Uint8Array
  pakFromXsk(spendingKey: Uint8Array): Uint8Array
  xfvkFromXsk(spendingKey: Uint8Array): Uint8Array
  ovkFromXfvk(viewingKey: Uint8Array): Uint8Array
  xfvkToIvk(viewingKey: Uint8Array): Uint8Array
  paymentAddressFromXfvk(viewingKey: Uint8Array, index: Uint8Array): Uint8Array
  defaultPaymentAddressFromXfvk(viewingKey: Uint8Array): Uint8Array
  nextPaymentAddressFromXfvk(viewingKey: Uint8Array, index: Uint8Array): Uint8Array
  paymentAddressFromIvk(incomingViewingKey: Uint8Array, diversifier: Uint8Array): Uint8Array
  diversifierFromPaymentAddress(address: Uint8Array): Uint8Array
  pkdFromPaymentAddress(address: Uint8Array): Uint8Array
  initProvingContext(): number
  dropProvingContext(context: number): void
  randR(): Uint8Array
  bindingSignature(context: number, valueBalance: string, sighash: Uint8Array): Uint8Array
  spendDescriptionFromXsk(
    context: number,
    spendingKey: Uint8Array,
    address: Uint8Array,
    rcm: Uint8Array,
    ar: Uint8Array,
    value: string,
    anchor: Uint8Array,
    merklePath: Uint8Array
  ): Uint8Array
  spendDescriptionFromPak(
    context: number,
    authorizingKey: Uint8Array,
    address: Uint8Array,
    rcm: Uint8Array,
    ar: Uint8Array,
    value: string,
    anchor: Uint8Array,
    merklePath: Uint8Array
  ): Uint8Array
  signSpendDescriptionWithXsk(
    description: Uint8Array,
    spendingKey: Uint8Array,
    ar: Uint8Array,
    sighash: Uint8Array
  ): Uint8Array
  outputDescriptionFromXfvk(
    context: number,
    viewingKey: Uint8Array,
    destination: Uint8Array,
    rcm: Uint8Array,
    value: string
  ): Uint8Array
  outputDescriptionFromXfvkWithMemo(
    context: number,
    viewingKey: Uint8Array,
    destination: Uint8Array,
    rcm: Uint8Array,
    value: string,
    memo: Uint8Array
  ): Uint8Array
  partialOutputDescription(
    context: number,
    destination: Uint8Array,
    rcm: Uint8Array,
    ephemeralKey: Uint8Array,
    value: string
  ): Uint8Array
  deriveEpkFromEsk(diversifier: Uint8Array, privateKey: Uint8Array): Uint8Array
  computeCommitment(address: Uint8Array, value: string, rcm: Uint8Array): Uint8Array
  computeNullifier(
    viewingKey: Uint8Array,
    address: Uint8Array,
    value: string,
    rcm: Uint8Array,
    position: string
  ): Uint8Array
  merkleHash(depth: number, lhs: Uint8Array, rhs: Uint8Array): Uint8Array
  keyAgreement(p: Uint8Array, sk: Uint8Array): Uint8Array
}
