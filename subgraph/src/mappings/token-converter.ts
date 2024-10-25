import { Address, BigInt } from "@graphprotocol/graph-ts";

import { TokenInfo } from "../pb/dex223/v1/TokenInfo";
import { Token as TokenStream } from "../pb/dex223/v1/Token";
import { ERC20WrapperCreatedEvent } from "../pb/dex223/v1/ERC20WrapperCreatedEvent";
import { ERC223WrapperCreatedEvent } from "../pb/dex223/v1/ERC223WrapperCreatedEvent";
import { TokenConvertible, Token } from "../../generated/schema";

function saveConverter(
  addressERC20: Address,
  addressERC223: Address,
  tokenInfo: TokenInfo
): void {
  // Проверяем, что decimals не undefined
  let decimals = tokenInfo.decimals;

  // Проверяем, что symbol и name не undefined
  let symbol = tokenInfo.symbol;
  let name = tokenInfo.name;
  // if (symbol === undefined || name === undefined) {
  //   return;
  // }

  let id = `${addressERC20.toHexString()}-${addressERC223.toHexString()}`;
  let token = TokenConvertible.load(id);
  if (token === null) {
    token = new TokenConvertible(id);
    token.decimals = BigInt.fromI32(decimals as i32);
    token.symbol = symbol;
    token.name = name;
    token.addressERC20 = addressERC20.toHexString();
    token.addressERC223 = addressERC223.toHexString();
    token.save();
  }

  let _token = Token.load(addressERC20.toHexString());
  if (_token === null) {
    return;
  }
  _token.inConverter = true;
  _token.save();
}

export function handleERC20WrapperCreated(
  event: ERC20WrapperCreatedEvent
): void {
  let token = event.token as TokenStream;
  let tokenInfo = token.tokenInfo as TokenInfo;
  let addressErc20Str = token.addressErc20;
  let addressErc223Str = token.addressErc223;

  let addressERC20 = Address.fromString(addressErc20Str);
  let addressERC223 = Address.fromString(addressErc223Str);

  saveConverter(addressERC20, addressERC223, tokenInfo);
}

export function handleERC223WrapperCreated(
  event: ERC223WrapperCreatedEvent
): void {
  let token = event.token as TokenStream;
  let tokenInfo = token.tokenInfo as TokenInfo;
  let addressErc20Str = token.addressErc20;
  let addressErc223Str = token.addressErc223;

  let addressERC20 = Address.fromString(addressErc20Str);
  let addressERC223 = Address.fromString(addressErc223Str);

  saveConverter(addressERC20, addressERC223, tokenInfo);
}
