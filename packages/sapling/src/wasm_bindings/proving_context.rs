use wasm_bindgen::prelude::*;

use crate::common::utils::wasm_utils::{drop_proving_context, init_proving_context};
use crate::wasm_bindings::init::wasm_init_lib;

#[wasm_bindgen(catch, js_name = "initProvingContext")]
pub fn wasm_init_proving_context() -> Result<u32, JsValue> {
    wasm_init_lib();
    init_proving_context()
}

#[wasm_bindgen(catch, js_name = "dropProvingContext")]
pub fn wasm_drop_proving_context(ctx: u32) {
    wasm_init_lib();
    drop_proving_context(ctx);
}
