#![forbid(unsafe_code)]
#![allow(dead_code)]

#[cfg(feature = "wasm_bindings")]
pub(crate) use crate::state::State;
#[cfg(feature = "wasm_bindings")]
pub use wasm_bindings::{
    authorizing_key::*, commitment::*, init::*, key_agreement::*, merkle_tree::*,
    output_description::*, payment_address::*, proving_context::*, rand::*, signature::*,
    spend_description::*, spending_key::*, viewing_key::*,
};

#[cfg(feature = "wasm_bindings")]
mod wasm_bindings;

mod address;
mod common;
mod key;
mod transaction;

mod state;
