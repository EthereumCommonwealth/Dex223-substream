use crate::pb::dex223::v1::Transaction;

use substreams::{hex,  Hex};
use substreams_ethereum::pb::eth::v2::{TransactionTrace, Log};
use substreams::scalar::{BigInt};


pub const ADDRESS_FACTORY: [u8; 20] = hex!("9f3118af733Ea3Fe4f9Ed71033F25B6bcF7F49e9"); // EOS mainnet
pub const ADDRESS_CONVERTER: [u8; 20] = hex!("Dd90b13bcb92950CA9b6b3e0407d439533eA0df2"); //  EOS mainnet
pub const ADDRESS_ZERO: [u8; 20] = hex!("0000000000000000000000000000000000000000");


pub fn load_transaction(
    block_number: u64,
    timestamp: u64,
    log: &Log,
    transaction_trace: &TransactionTrace,
) -> Transaction {
    let mut transaction = Transaction {
        id: Hex(&transaction_trace.hash).to_string(),
        block_number,
        timestamp,
        gas_used: transaction_trace.gas_used,
        gas_price: Default::default(),
        from: Hex(&transaction_trace.from).to_string(),
        to: Hex(&transaction_trace.to).to_string(),
        address: Hex(&log.address).to_string(),
        log_ordinal: log.ordinal,
    };
    if let Some(gas_price) = &transaction_trace.gas_price {
        let gas_price: BigInt = BigInt::from_unsigned_bytes_be(&gas_price.bytes);
        transaction.gas_price = gas_price.to_string();
    }

    transaction
}