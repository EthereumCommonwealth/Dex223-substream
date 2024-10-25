/* eslint-disable prefer-const */
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const WETH_ADDRESS = "{{ WETH }}";
export const USDC_WETH_03_POOL = "{{ v1.WETH_USDC_03_POOL }}";

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = "{{ v1.whitelistAddresses }}".split(
  ","
);

export const FACTORY_ADDRESS = "{{ v1.contracts.factory.address }}";

export const STABLE_COINS: string[] = "{{ v1.stableCoins }}".split(",");
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
