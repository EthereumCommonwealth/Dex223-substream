// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transaction {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub block_number: u64,
    #[prost(uint64, tag="3")]
    pub timestamp: u64,
    #[prost(uint64, tag="4")]
    pub gas_used: u64,
    #[prost(string, tag="5")]
    pub gas_price: ::prost::alloc::string::String,
    #[prost(uint64, tag="6")]
    pub log_ordinal: u64,
    #[prost(string, tag="7")]
    pub address: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub from: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub to: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TokenInfo {
    #[prost(string, tag="1")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub symbol: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub decimals: u64,
    #[prost(bool, tag="4")]
    pub in_converter: bool,
    #[prost(string, tag="5")]
    pub total_supply: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Token {
    #[prost(string, tag="1")]
    pub address_erc20: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub address_erc223: ::prost::alloc::string::String,
    #[prost(message, optional, tag="3")]
    pub token_info: ::core::option::Option<TokenInfo>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PoolEvents {
    #[prost(message, repeated, tag="1")]
    pub pool_created_events: ::prost::alloc::vec::Vec<PoolCreatedEvent>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PoolCreatedEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(message, optional, tag="2")]
    pub token0: ::core::option::Option<Token>,
    #[prost(message, optional, tag="3")]
    pub token1: ::core::option::Option<Token>,
    #[prost(string, tag="4")]
    pub fee: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub pool_address: ::prost::alloc::string::String,
    #[prost(int32, tag="6")]
    pub tick_spacing: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct InitializeEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(string, tag="2")]
    pub sqrt_price_x96: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub tick: i32,
    #[prost(string, tag="4")]
    pub pool_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct SwapEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(string, tag="2")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub recipient: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub amount0: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub amount1: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub sqrt_price_x96: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub liquidity: ::prost::alloc::string::String,
    #[prost(int32, tag="8")]
    pub tick: i32,
    #[prost(string, tag="9")]
    pub pool_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MintEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(string, tag="2")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub owner: ::prost::alloc::string::String,
    #[prost(int32, tag="4")]
    pub tick_lower: i32,
    #[prost(int32, tag="5")]
    pub tick_upper: i32,
    #[prost(string, tag="6")]
    pub amount: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub amount0: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub amount1: ::prost::alloc::string::String,
    #[prost(string, tag="9")]
    pub pool_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BurnEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(string, tag="2")]
    pub owner: ::prost::alloc::string::String,
    #[prost(int32, tag="3")]
    pub tick_lower: i32,
    #[prost(int32, tag="4")]
    pub tick_upper: i32,
    #[prost(string, tag="5")]
    pub amount: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub amount0: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub amount1: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub pool_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CollectEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(string, tag="2")]
    pub recipient: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub owner: ::prost::alloc::string::String,
    #[prost(int32, tag="4")]
    pub tick_lower: i32,
    #[prost(int32, tag="5")]
    pub tick_upper: i32,
    #[prost(string, tag="6")]
    pub amount0: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub amount1: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub pool_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct FlashEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(string, tag="2")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub recipient: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub amount0: ::prost::alloc::string::String,
    #[prost(string, tag="5")]
    pub amount1: ::prost::alloc::string::String,
    #[prost(string, tag="6")]
    pub paid0: ::prost::alloc::string::String,
    #[prost(string, tag="7")]
    pub paid1: ::prost::alloc::string::String,
    #[prost(string, tag="8")]
    pub pool_address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Erc20WrapperCreatedEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(message, optional, tag="2")]
    pub token: ::core::option::Option<Token>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Erc223WrapperCreatedEvent {
    #[prost(message, optional, tag="1")]
    pub tx: ::core::option::Option<Transaction>,
    #[prost(message, optional, tag="2")]
    pub token: ::core::option::Option<Token>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TokenConverterEvents {
    #[prost(message, repeated, tag="1")]
    pub erc223_to_erc20: ::prost::alloc::vec::Vec<Erc20WrapperCreatedEvent>,
    #[prost(message, repeated, tag="2")]
    pub erc20_to_erc223: ::prost::alloc::vec::Vec<Erc223WrapperCreatedEvent>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TokenInfos {
    #[prost(message, repeated, tag="1")]
    pub tokens: ::prost::alloc::vec::Vec<Token>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Events {
    #[prost(message, repeated, tag="1")]
    pub pool_created_events: ::prost::alloc::vec::Vec<PoolCreatedEvent>,
    #[prost(message, repeated, tag="2")]
    pub initialize_events: ::prost::alloc::vec::Vec<InitializeEvent>,
    #[prost(message, repeated, tag="3")]
    pub swap_events: ::prost::alloc::vec::Vec<SwapEvent>,
    #[prost(message, repeated, tag="4")]
    pub mint_events: ::prost::alloc::vec::Vec<MintEvent>,
    #[prost(message, repeated, tag="5")]
    pub burn_events: ::prost::alloc::vec::Vec<BurnEvent>,
    #[prost(message, repeated, tag="6")]
    pub flash_events: ::prost::alloc::vec::Vec<FlashEvent>,
    #[prost(message, repeated, tag="7")]
    pub collect_events: ::prost::alloc::vec::Vec<CollectEvent>,
    #[prost(message, repeated, tag="8")]
    pub erc20_wrapper_created_events: ::prost::alloc::vec::Vec<Erc20WrapperCreatedEvent>,
    #[prost(message, repeated, tag="9")]
    pub erc223_wrapper_created_events: ::prost::alloc::vec::Vec<Erc223WrapperCreatedEvent>,
}
// @@protoc_insertion_point(module)
