use crate::utils;
use crate::abi;
use crate::pb;
use crate::static_token_definition::{get_static_definition, get_static_token_definitions};
use substreams_ethereum::rpc::RpcBatch;

#[derive(Debug, Clone, Copy)]
enum TokenType {
    ERC20,
    ERC223,
}

fn get_token_info(token_address: &str, token_type: TokenType) -> Option<pb::dex223::v1::TokenInfo> {
    let token_address_bytes = match hex::decode(token_address.trim_start_matches("0x")) {
        Ok(bytes) => bytes,
        Err(_) => {
            substreams::log::debug!("Invalid token address: {}", token_address);
            return None;
        }
    };

    // Получаем статические определения токенов
    let static_definitions = get_static_token_definitions();

    // Проверяем, есть ли токен в статических определениях
    if let Some(definition) = get_static_definition(&token_address_bytes, &static_definitions) {
        substreams::log::debug!("Token found in static definitions: {}", token_address);

        // Проверяем total_supply
        if definition.total_supply == "0" || definition.total_supply.is_empty() {
            substreams::log::debug!("Total supply is zero or empty for token: {}", token_address);
            return None;
        }

        // Инициализируем TokenInfo из статических данных
        let mut token_info = pb::dex223::v1::TokenInfo {
            name: definition.name.clone(),
            symbol: definition.symbol.clone(),
            decimals: definition.decimals as u64,
            in_converter: definition.in_converter,
            total_supply: definition.total_supply.clone(),
        };

        // Дополнительные проверки или извлечение данных из конвертера для статических токенов
        let converter_address = utils::ADDRESS_CONVERTER.to_vec();
        let token_address_bytes_fixed: [u8; 20] = match token_address_bytes.as_slice().try_into() {
            Ok(bytes) => bytes,
            Err(_) => {
                substreams::log::debug!("Invalid token address length: {}", token_address);
                return None;
            }
        };

        let batch = match token_type {
            TokenType::ERC20 => {
                RpcBatch::new()
                    .add(
                        abi::token_converter::functions::GetErc223WrapperFor { token: token_address_bytes_fixed.to_vec() },
                        converter_address.clone(),
                    )
            },
            TokenType::ERC223 => {
                RpcBatch::new()
                    .add(
                        abi::token_converter::functions::GetErc20WrapperFor { token: token_address_bytes_fixed.to_vec() },
                        converter_address.clone(),
                    )
            },
        };

        // Выполняем соответствующие RPC вызовы
        let responses = match batch.execute() {
            Ok(batch_response) => batch_response.responses,
            Err(e) => {
                substreams::log::debug!("RPC batch execution failed: {}", e);
                return Some(token_info); // Возвращаем статическую информацию даже при ошибке RPC
            }
        };

        // Проверка наличия соответствующей обёртки
        match token_type {
            TokenType::ERC20 => {
                match RpcBatch::decode::<_, abi::token_converter::functions::GetErc223WrapperFor>(&responses[0]) {
                    Some(erc223_result) => {
                        if erc223_result != utils::ADDRESS_ZERO {
                            token_info.in_converter = true;
                            substreams::log::info!("Found ERC223 wrapper for token: {}", token_address);
                        }
                    }
                    None => {
                        substreams::log::info!("Failed to get ERC223 wrapper");
                    }
                };
            },
            TokenType::ERC223 => {
                match RpcBatch::decode::<_, abi::token_converter::functions::GetErc20WrapperFor>(&responses[0]) {
                    Some(erc20_result) => {
                        if erc20_result != utils::ADDRESS_ZERO {
                            token_info.in_converter = true;
                            substreams::log::info!("Found ERC20 wrapper for token: {}", token_address);
                        }
                    }
                    None => {
                        substreams::log::info!("Failed to get ERC20 wrapper");
                    }
                };
            },
        }

        substreams::log::info!("Token in converter: {}", token_info.in_converter);

        // Проверка total_supply
        if token_info.total_supply == "0" || token_info.total_supply.is_empty() {
            substreams::log::debug!("Total supply is zero or empty for token: {}", token_address);
            return None;
        }

        return Some(token_info);
    }

    // Если токен не найден в статических определениях, выполняем RPC вызовы
    let token_address_bytes_fixed: [u8; 20] = match token_address_bytes.as_slice().try_into() {
        Ok(bytes) => bytes,
        Err(_) => {
            substreams::log::debug!("Invalid token address length: {}", token_address);
            return None;
        }
    };

    let converter_address = utils::ADDRESS_CONVERTER.to_vec();

    let batch = match token_type {
        TokenType::ERC20 => {
            RpcBatch::new()
                .add(
                    abi::erc20_erc223::functions::Decimals {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::erc20_erc223::functions::Name {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::erc20_erc223::functions::Symbol {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::erc20_erc223::functions::TotalSupply {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::token_converter::functions::GetErc223WrapperFor { token: token_address_bytes_fixed.to_vec() },
                    converter_address.clone(),
                )
        },
        TokenType::ERC223 => {
            RpcBatch::new()
                .add(
                    abi::erc20_erc223::functions::Decimals {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::erc20_erc223::functions::Name {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::erc20_erc223::functions::Symbol {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::erc20_erc223::functions::TotalSupply {},
                    token_address_bytes_fixed.to_vec(),
                )
                .add(
                    abi::token_converter::functions::GetErc20WrapperFor { token: token_address_bytes_fixed.to_vec() },
                    converter_address.clone(),
                )
        },
    };

    // Выполняем соответствующие RPC вызовы
    let responses = match batch.execute() {
        Ok(batch_response) => batch_response.responses,
        Err(e) => {
            substreams::log::debug!("RPC batch execution failed: {}", e);
            return None;
        }
    };

    let decimals: u64;
    let mut name: String = "unknown".to_string();
    let mut symbol: String = "unknown".to_string();
    let mut in_converter: bool = false;

    // Обработка ответа Decimals
    match RpcBatch::decode::<_, abi::erc20_erc223::functions::Decimals>(&responses[0]) {
        Some(decoded_decimals) => {
            decimals = decoded_decimals.to_u64();
            substreams::log::debug!("decoded_decimals ok: {}", decimals);
        }
        None => {
            substreams::log::debug!("failed to get decimals");
            return None;
        }
    };

    // Обработка ответа Name
    match RpcBatch::decode::<_, abi::erc20_erc223::functions::Name>(&responses[1]) {
        Some(decoded_name) => {
            name = decoded_name;
            substreams::log::debug!("decoded_name ok: {}", name);
        }
        None => {
            substreams::log::debug!("failed to get name");
        }
    };

    // Обработка ответа Symbol
    match RpcBatch::decode::<_, abi::erc20_erc223::functions::Symbol>(&responses[2]) {
        Some(decoded_symbol) => {
            symbol = decoded_symbol;
            substreams::log::debug!("decoded_symbol ok: {}", symbol);
        }
        None => {
            substreams::log::debug!("failed to get symbol");
        }
    };

    // Обработка ответа TotalSupply
    let total_supply: String = match RpcBatch::decode::<_, abi::erc20_erc223::functions::TotalSupply>(&responses[3]) {
        Some(decoded_total_supply) => {
            substreams::log::debug!("decoded_total_supply ok: {}", decoded_total_supply.to_string());
            decoded_total_supply.to_string()
        }
        None => {
            substreams::log::debug!("failed to get total_supply");
            "0".to_string()
        }
    };

    // Проверка наличия соответствующей обёртки
    match token_type {
        TokenType::ERC20 => {
            match RpcBatch::decode::<_, abi::token_converter::functions::GetErc223WrapperFor>(&responses[4]) {
                Some(erc223_result) => {
                    if erc223_result != utils::ADDRESS_ZERO {
                        in_converter = true;
                        substreams::log::info!("Found ERC223 wrapper for token: {}", token_address);
                    }
                }
                None => {
                    substreams::log::info!("Failed to get ERC223 wrapper");
                }
            };
        },
        TokenType::ERC223 => {
            match RpcBatch::decode::<_, abi::token_converter::functions::GetErc20WrapperFor>(&responses[4]) {
                Some(erc20_result) => {
                    if erc20_result != utils::ADDRESS_ZERO {
                        in_converter = true;
                        substreams::log::info!("Found ERC20 wrapper for token: {}", token_address);
                    }
                }
                None => {
                    substreams::log::info!("Failed to get ERC20 wrapper");
                }
            };
        },
    }

    substreams::log::info!("Token in converter: {}", in_converter);

    // Проверка total_supply
    if total_supply == "0" || total_supply.is_empty() {
        substreams::log::debug!("Total supply is zero or empty for token: {}", token_address);
        return None;
    }

    Some(pb::dex223::v1::TokenInfo {
        name,
        symbol,
        decimals,
        in_converter,
        total_supply,
    })
}

fn get_erc20_token_info(token_address_erc20: &str) -> Option<pb::dex223::v1::TokenInfo> {
    // Реализуйте логику получения информации о ERC20 токене
    get_token_info(token_address_erc20, TokenType::ERC20)
}

fn get_erc223_token_info(token_address_erc223: &str) -> Option<pb::dex223::v1::TokenInfo> {
    // Реализуйте логику получения информации о ERC223 токене
    get_token_info(token_address_erc223, TokenType::ERC223)
}

pub fn get_token_with_fallback(token_address_erc20: &str, token_address_erc223: &str) -> Option<pb::dex223::v1::Token> {
    // Сначала пробуем получить информацию по адресу ERC20
    if let Some(token_info) = get_erc20_token_info(token_address_erc20) {
        return Some(pb::dex223::v1::Token {
            address_erc20: token_address_erc20.to_string(),
            address_erc223: token_address_erc223.to_string(),
            token_info: Some(token_info),
        });
    }

    // Если информация по ERC20 не найдена, пробуем для адреса ERC223
    if let Some(token_info) = get_erc223_token_info(token_address_erc223) {
        return Some(pb::dex223::v1::Token {
            address_erc20: token_address_erc20.to_string(),
            address_erc223: token_address_erc223.to_string(),
            token_info: Some(token_info),
        });
    }

    // Если информации нет ни по одному из адресов, возвращаем None
    None
}
