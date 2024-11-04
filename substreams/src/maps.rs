use crate::abi;
use crate::pb;
use crate::utils;
use crate::token;

use substreams::store::{StoreGet, StoreGetProto, StoreSetProto, StoreSet, StoreNew};

use substreams_ethereum::Event;
use substreams_ethereum::pb::eth::v2 as eth;

use pb::dex223::v1::{
    Events, PoolCreatedEvent, InitializeEvent, SwapEvent, MintEvent, BurnEvent, CollectEvent, PoolEvents,
    FlashEvent, TokenConverterEvents, Erc223WrapperCreatedEvent, Erc20WrapperCreatedEvent
};

/// Handler for handling pool creation events and associated data
#[substreams::handlers::map]
fn map_pools(
    block: eth::Block,
) -> Result<PoolEvents, substreams::errors::Error> {
    let mut pool_events = PoolEvents {
        pool_created_events: vec![],
    };

    let block_number = block.number;
    let block_timestamp = block.header.as_ref().unwrap().timestamp.as_ref().unwrap().seconds as u64;

    let factory_address = utils::ADDRESS_FACTORY.to_vec();

    for trx in block.transaction_traces {
        let tx_receipt = match &trx.receipt {
            Some(receipt) => receipt,
            None => continue,
        };

        for log in &tx_receipt.logs {
            let transaction = utils::load_transaction(block_number, block_timestamp, &log, &trx,);

            // Decoding the PoolCreated event
            if let Some(event) = abi::factory::events::PoolCreated::match_and_decode(log) {
                // Check if the address matches the factory address
                if log.address == factory_address {
                    let pool_address = event.pool.clone();
                    let token0 = token::get_token_with_fallback(&hex::encode(event.token0_erc20), &hex::encode(event.token0_erc223));
                    let token1 = token::get_token_with_fallback(&hex::encode(event.token1_erc20), &hex::encode(event.token1_erc223));

                    let pool_created_event = PoolCreatedEvent {
                        tx: Some(transaction.clone()),
                        token0: token0.clone(),
                        token1: token1.clone(),
                        fee: event.fee.to_string(),
                        pool_address: hex::encode(&pool_address),
                        tick_spacing: event.tick_spacing.to_i32(),
                    };

                    pool_events.pool_created_events.push(pool_created_event);
                }
            }
        }
    }

    Ok(pool_events)
}

#[substreams::handlers::map]
fn map_token_convertes(
    block: eth::Block,
) -> Result<TokenConverterEvents, substreams::errors::Error> {
    let mut token_converters = TokenConverterEvents {
        erc20_to_erc223: vec![],
        erc223_to_erc20: vec![],
    };

    let block_number = block.number;
    let block_timestamp = block.header.as_ref().unwrap().timestamp.as_ref().unwrap().seconds as u64;

    let converter_address = utils::ADDRESS_CONVERTER.to_vec();

    for trx in block.transaction_traces {
        let tx_receipt = match &trx.receipt {
            Some(receipt) => receipt,
            None => continue,
        };

        for log in &tx_receipt.logs {
            let transaction = utils::load_transaction(block_number, block_timestamp, &log, &trx);
            if log.address == converter_address {
            // Decoding the TokenConverterCreated event
                if let Some(event) = abi::token_converter::events::Erc20WrapperCreated::match_and_decode(log) {
                    // Check if the address matches the converter address
                    let token = token::get_token_with_fallback(&hex::encode(&event.erc20_wrapper), &hex::encode(&event.token));
                    token_converters.erc223_to_erc20.push(Erc20WrapperCreatedEvent {
                        tx: Some(transaction.clone()),
                        token: token.clone(),
                    });

                
                }
                if let Some(event) = abi::token_converter::events::Erc223WrapperCreated::match_and_decode(log) {
                    // Check if the address matches the converter address
                    let token = token::get_token_with_fallback(&hex::encode(&event.token), &hex::encode(&event.erc223_wrapper));
                    token_converters.erc20_to_erc223.push(Erc223WrapperCreatedEvent {
                        tx: Some(transaction.clone()),
                        token: token.clone(),
                    });
                    
                }
            }
        }
    }

    Ok(token_converters)
}


/// Handler for storing pool information in storage
#[substreams::handlers::store]
fn store_pools(
    pool_events: PoolEvents,
    output_store: StoreSetProto<pb::dex223::v1::PoolCreatedEvent>,
) {
    for event in pool_events.pool_created_events {
        let pool_address = &event.pool_address;
        output_store.set(
            event.tx.as_ref().unwrap().log_ordinal,
            pool_address,
            &event,
        );
    }
}

/// Handler for storing token information in storage
#[substreams::handlers::store]
fn store_tokens(
    pool_events: PoolEvents,
    output_store: StoreSetProto<pb::dex223::v1::TokenInfo>,
) {
    for event in pool_events.pool_created_events {
        if let Some(token) = &event.token0 {
            output_store.set(
                event.tx.as_ref().unwrap().log_ordinal,
                &token.address_erc20,
                token.token_info.as_ref().unwrap(),
            );
        }
        if let Some(token) = &event.token1 {
            output_store.set(
                event.tx.as_ref().unwrap().log_ordinal,
                &token.address_erc20,
                token.token_info.as_ref().unwrap(),
            );
        }
    }
}



#[substreams::handlers::map]
fn map_events(
    block: eth::Block,
    pool_events: PoolEvents, // Added
    token_converters: TokenConverterEvents, // Added
    store_pools: StoreGetProto<pb::dex223::v1::PoolCreatedEvent>,
    _store_tokens: StoreGetProto<pb::dex223::v1::TokenInfo>,
) -> Result<Events, substreams::errors::Error> {

    let mut events = Events {
        pool_created_events: pool_events.pool_created_events.clone(), // Use data from map_pools
        erc20_wrapper_created_events: token_converters.erc223_to_erc20.clone(), // Use data from map_token_convertes
        erc223_wrapper_created_events: token_converters.erc20_to_erc223.clone(),
        initialize_events: vec![],
        swap_events: vec![],
        mint_events: vec![],
        burn_events: vec![],
        flash_events: vec![],
        collect_events: vec![],
    };

    let block_number = block.number;
    let block_timestamp = block
        .header
        .as_ref()
        .unwrap()
        .timestamp
        .as_ref()
        .unwrap()
        .seconds as u64;

    // Create set pools, have created in this block
    let new_pools: std::collections::HashSet<String> = events
        .pool_created_events
        .iter()
        .map(|e| e.pool_address.clone())
        .collect();

    for trx in block.transaction_traces {
        let tx_receipt = match &trx.receipt {
            Some(receipt) => receipt,
            None => continue,
        };

        for log in &tx_receipt.logs {
            let transaction =
                utils::load_transaction(block_number, block_timestamp, &log, &trx);

            // Address pool from log
            let pool_address = log.address.clone();
            let pool_address_hex = hex::encode(&pool_address);

            // Check already exists pool by factory
            let pool_exists = store_pools.get_last(&pool_address_hex).is_some()
                || new_pools.contains(&pool_address_hex);

            if pool_exists {
                // Check event Initialize
                if let Some(event) = abi::pool::events::Initialize::match_and_decode(log) {
                    let initialize_event = InitializeEvent {
                        tx: Some(transaction.clone()),
                        sqrt_price_x96: event.sqrt_price_x96.to_string(),
                        tick: event.tick.to_i32(),
                        pool_address: hex::encode(&pool_address),
                    };
                    events.initialize_events.push(initialize_event);
                    continue;
                }

                // Check event Swap
                if let Some(event) = abi::pool::events::Swap::match_and_decode(log) {
                    let swap_event = SwapEvent {
                        tx: Some(transaction.clone()),
                        sender: hex::encode(event.sender),
                        recipient: hex::encode(event.recipient),
                        amount0: event.amount0.to_string(),
                        amount1: event.amount1.to_string(),
                        sqrt_price_x96: event.sqrt_price_x96.to_string(),
                        liquidity: event.liquidity.to_string(),
                        tick: event.tick.to_i32(),
                        pool_address: hex::encode(&pool_address),
                    };
                    events.swap_events.push(swap_event);
                    continue;
                }

                // Check event Mint
                if let Some(event) = abi::pool::events::Mint::match_and_decode(log) {
                    let mint_event = MintEvent {
                        tx: Some(transaction.clone()),
                        owner: hex::encode(event.owner),
                        sender: hex::encode(event.sender),
                        tick_lower: event.tick_lower.to_i32(),
                        tick_upper: event.tick_upper.to_i32(),
                        amount: event.amount.to_string(),
                        amount0: event.amount0.to_string(),
                        amount1: event.amount1.to_string(),
                        pool_address: hex::encode(&pool_address),
                    };
                    events.mint_events.push(mint_event);
                    continue;
                }

                // Check event Burn
                if let Some(event) = abi::pool::events::Burn::match_and_decode(log) {
                    let burn_event = BurnEvent {
                        tx: Some(transaction.clone()),
                        owner: hex::encode(event.owner),
                        tick_lower: event.tick_lower.to_i32(),
                        tick_upper: event.tick_upper.to_i32(),
                        amount: event.amount.to_string(),
                        amount0: event.amount0.to_string(),
                        amount1: event.amount1.to_string(),
                        pool_address: hex::encode(&pool_address),
                    };
                    events.burn_events.push(burn_event);
                    continue;
                }

                // Check event Collect
                if let Some(event) = abi::pool::events::Collect::match_and_decode(log) {
                    let collect_event = CollectEvent {
                        tx: Some(transaction.clone()),
                        owner: hex::encode(event.owner),
                        recipient: hex::encode(event.recipient),
                        tick_lower: event.tick_lower.to_i32(),
                        tick_upper: event.tick_upper.to_i32(),
                        amount0: event.amount0.to_string(),
                        amount1: event.amount1.to_string(),
                        pool_address: hex::encode(&pool_address),
                    };
                    events.collect_events.push(collect_event);
                    continue;
                }
                if let Some(event) = abi::pool::events::Flash::match_and_decode(log) {
                    let flash_events = FlashEvent {
                        tx: Some(transaction.clone()),
                        sender: hex::encode(event.sender),
                        recipient: hex::encode(event.recipient),
                        amount0: event.amount0.to_string(),
                        amount1: event.amount1.to_string(),
                        paid0: event.paid0.to_string(),
                        paid1: event.paid1.to_string(),
                        pool_address: hex::encode(&pool_address),
                    };
                    events.flash_events.push(flash_events);
                    continue;
                }
            }
        }
    }

    Ok(events)
}
