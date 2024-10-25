/* eslint-disable prefer-const */
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
// import { Factory as FactoryContract } from '../types/templates/Pool/Factory'
// import { TokenConverter as TokenConverterContract } from '../types/templates/Pool/TokenConverter'

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
// export const FACTORY_ADDRESS = '0x9f3118af733ea3fe4f9ed71033f25b6bcf7f49e9'
// export const TOKEN_CONVERTER_ADDRESS = ''

export const WETH_ADDRESS = "0xc00592aa41d32d137dc480d9f6d0df19b860104f";
export const USDC_WETH_03_POOL = "0xed93d8b3951f73d6707919e649ef59235e64beb6";

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = "0xc00592aa41d32d137dc480d9f6d0df19b860104f,0x33b57dc70014fd7aa6e1ed3080eed2b619632b8e".split(
  ","
);

export const FACTORY_ADDRESS = "0x9f3118af733ea3fe4f9ed71033f25b6bcf7f49e9";

export const STABLE_COINS: string[] = "0x33b57dc70014fd7aa6e1ed3080eed2b619632b8e".split(",");
export const STABLECOIN_IS_TOKEN0 = true;

export let MINIMUM_ETH_LOCKED = BigDecimal.fromString("60");

export let Q192 = BigDecimal.fromString(
  "6277101735386680763835789423207666416102355444464034512896"
); // 2^192

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
