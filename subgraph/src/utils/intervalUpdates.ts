import { Address } from "@graphprotocol/graph-ts";
import { Transaction } from "../pb/dex223/v1/Transaction";
import {
  Bundle,
  Factory,
  Pool,
  PoolDayData,
  PoolHourData,
  Token,
  TokenDayData,
  TokenHourData,
  Dex223DayData,
} from "../../generated/schema";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./constants";
import { FACTORY_ADDRESS } from "./constants";

/**
 * Tracks global aggregate data over daily windows
 * @param tx
 */
export function updateDex223DayData(
  tx: Transaction,
  factoryAddress: string = FACTORY_ADDRESS
): Dex223DayData {
  const dex223 = Factory.load(factoryAddress)!;
  const timestamp = tx.timestamp;
  const dayID = timestamp / 86400; // rounded
  const dayStartTimestamp = dayID * 86400;
  let dex223DayData = Dex223DayData.load(dayID.toString());
  if (dex223DayData === null) {
    dex223DayData = new Dex223DayData(dayID.toString());
    dex223DayData.date = dayStartTimestamp as i32;
    dex223DayData.volumeETH = ZERO_BD;
    dex223DayData.volumeUSD = ZERO_BD;
    dex223DayData.volumeUSDUntracked = ZERO_BD;
    dex223DayData.feesUSD = ZERO_BD;
  }
  dex223DayData.tvlUSD = dex223.totalValueLockedUSD;
  dex223DayData.txCount = dex223.txCount;
  dex223DayData.save();
  return dex223DayData as Dex223DayData;
}

export function updatePoolDayData(tx: Transaction): PoolDayData {
  const timestamp = tx.timestamp;
  const dayID = timestamp / 86400;
  const dayStartTimestamp = dayID * 86400;
  const tx_address = Address.fromString(tx.address);
  const dayPoolID = tx_address
    .toHexString()
    .concat("-")
    .concat(dayID.toString());
  const pool = Pool.load(tx_address.toHexString())!;
  let poolDayData = PoolDayData.load(dayPoolID);
  if (poolDayData === null) {
    poolDayData = new PoolDayData(dayPoolID);
    poolDayData.date = dayStartTimestamp as i32;
    poolDayData.pool = pool.id;
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD;
    poolDayData.volumeToken1 = ZERO_BD;
    poolDayData.volumeUSD = ZERO_BD;
    poolDayData.feesUSD = ZERO_BD;
    poolDayData.txCount = ZERO_BI;
    poolDayData.open = pool.token0Price;
    poolDayData.high = pool.token0Price;
    poolDayData.low = pool.token0Price;
    poolDayData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolDayData.high)) {
    poolDayData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolDayData.low)) {
    poolDayData.low = pool.token0Price;
  }

  poolDayData.liquidity = pool.liquidity;
  poolDayData.sqrtPrice = pool.sqrtPrice;
  poolDayData.token0Price = pool.token0Price;
  poolDayData.token1Price = pool.token1Price;
  poolDayData.close = pool.token0Price;
  poolDayData.tick = pool.tick;
  poolDayData.tvlUSD = pool.totalValueLockedUSD;
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI);
  poolDayData.save();

  return poolDayData as PoolDayData;
}

export function updatePoolHourData(tx: Transaction): PoolHourData {
  const timestamp = tx.timestamp;
  const hourIndex = timestamp / 3600; // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600; // want the rounded effect
  const tx_address = Address.fromString(tx.address);
  const hourPoolID = tx_address
    .toHexString()
    .concat("-")
    .concat(hourIndex.toString());
  const pool = Pool.load(tx_address.toHexString())!;
  let poolHourData = PoolHourData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new PoolHourData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix as i32;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.open = pool.token0Price;
    poolHourData.high = pool.token0Price;
    poolHourData.low = pool.token0Price;
    poolHourData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolHourData.high)) {
    poolHourData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low)) {
    poolHourData.low = pool.token0Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.close = pool.token0Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as PoolHourData;
}

export function updateTokenDayData(
  token: Token,
  tx: Transaction
): TokenDayData {
  const bundle = Bundle.load("1")!;
  const timestamp = tx.timestamp;
  const dayID = timestamp / 86400;
  const dayStartTimestamp = dayID * 86400;
  const tokenDayID = token.id
    .toString()
    .concat("-")
    .concat(dayID.toString());
  const tokenPrice = token.derivedETH.times(bundle.ethPriceUSD);

  let tokenDayData = TokenDayData.load(tokenDayID);
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID);
    tokenDayData.date = dayStartTimestamp as i32;
    tokenDayData.token = token.id;
    tokenDayData.volume = ZERO_BD;
    tokenDayData.volumeUSD = ZERO_BD;
    tokenDayData.feesUSD = ZERO_BD;
    tokenDayData.untrackedVolumeUSD = ZERO_BD;
    tokenDayData.open = tokenPrice;
    tokenDayData.high = tokenPrice;
    tokenDayData.low = tokenPrice;
    tokenDayData.close = tokenPrice;
  }

  if (tokenPrice.gt(tokenDayData.high)) {
    tokenDayData.high = tokenPrice;
  }

  if (tokenPrice.lt(tokenDayData.low)) {
    tokenDayData.low = tokenPrice;
  }

  tokenDayData.close = tokenPrice;
  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPriceUSD);
  tokenDayData.totalValueLocked = token.totalValueLocked;
  tokenDayData.totalValueLockedUSD = token.totalValueLockedUSD;
  tokenDayData.save();

  return tokenDayData as TokenDayData;
}

export function updateTokenHourData(
  token: Token,
  tx: Transaction
): TokenHourData {
  const bundle = Bundle.load("1")!;
  const timestamp = tx.timestamp;
  const hourIndex = timestamp / 3600; // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600; // want the rounded effect
  const tokenHourID = token.id
    .toString()
    .concat("-")
    .concat(hourIndex.toString());
  let tokenHourData = TokenHourData.load(tokenHourID);
  const tokenPrice = token.derivedETH.times(bundle.ethPriceUSD);

  if (tokenHourData === null) {
    tokenHourData = new TokenHourData(tokenHourID);
    tokenHourData.periodStartUnix = hourStartUnix as i32;
    tokenHourData.token = token.id;
    tokenHourData.volume = ZERO_BD;
    tokenHourData.volumeUSD = ZERO_BD;
    tokenHourData.untrackedVolumeUSD = ZERO_BD;
    tokenHourData.feesUSD = ZERO_BD;
    tokenHourData.open = tokenPrice;
    tokenHourData.high = tokenPrice;
    tokenHourData.low = tokenPrice;
    tokenHourData.close = tokenPrice;
  }

  if (tokenPrice.gt(tokenHourData.high)) {
    tokenHourData.high = tokenPrice;
  }

  if (tokenPrice.lt(tokenHourData.low)) {
    tokenHourData.low = tokenPrice;
  }

  tokenHourData.close = tokenPrice;
  tokenHourData.priceUSD = tokenPrice;
  tokenHourData.totalValueLocked = token.totalValueLocked;
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD;
  tokenHourData.save();

  return tokenHourData as TokenHourData;
}
