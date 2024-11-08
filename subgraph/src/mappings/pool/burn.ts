import { BigInt, Address } from "@graphprotocol/graph-ts";

import {
  Bundle,
  Burn,
  Factory,
  Pool,
  Tick,
  Token,
} from "../../../generated/schema";
import { BurnEvent } from "../../pb/dex223/v1/BurnEvent";
import { Transaction } from "../../pb/dex223/v1/Transaction";

import { convertTokenToDecimal, loadTransaction } from "../../utils";
import { FACTORY_ADDRESS, ONE_BI } from "../../utils/constants";
import {
  updatePoolDayData,
  updatePoolHourData,
  updateTokenDayData,
  updateTokenHourData,
  updateDex223DayData,
} from "../../utils/intervalUpdates";

export function handleBurn(event: BurnEvent): void {
  handleBurnHelper(event);
}

// Note: this handler need not adjust TVL because that is accounted for in the handleCollect handler
export function handleBurnHelper(
  event: BurnEvent,
  factoryAddress: string = FACTORY_ADDRESS
): void {
  const tx = event.tx as Transaction;
  const bundle = Bundle.load("1")!;
  const poolAddress = Address.fromString(event.poolAddress).toHexString();
  const pool = Pool.load(poolAddress)!;
  const factory = Factory.load(factoryAddress)!;

  const token0 = Token.load(pool.token0);
  const token1 = Token.load(pool.token1);

  if (token0 && token1) {
    const amount0 = convertTokenToDecimal(
      BigInt.fromString(event.amount0),
      token0.decimals
    );
    const amount1 = convertTokenToDecimal(
      BigInt.fromString(event.amount1),
      token1.decimals
    );

    const amountUSD = amount0
      .times(token0.derivedETH.times(bundle.ethPriceUSD))
      .plus(amount1.times(token1.derivedETH.times(bundle.ethPriceUSD)));

    // update globals
    factory.txCount = factory.txCount.plus(ONE_BI);

    // update token0 data
    token0.txCount = token0.txCount.plus(ONE_BI);

    // update token1 data
    token1.txCount = token1.txCount.plus(ONE_BI);

    // pool data
    pool.txCount = pool.txCount.plus(ONE_BI);
    // Pools liquidity tracks the currently active liquidity given pools current tick.
    // We only want to update it on burn if the position being burnt includes the current tick.
    if (
      pool.tick !== null &&
      BigInt.fromI32(event.tickLower).le(pool.tick as BigInt) &&
      BigInt.fromI32(event.tickUpper).gt(pool.tick as BigInt)
    ) {
      // todo: this liquidity can be calculated from the real reserves and
      // current price instead of incrementally from every burned amount which
      // may not be accurate: https://linear.app/uniswap/issue/DAT-336/fix-pool-liquidity
      pool.liquidity = pool.liquidity.minus(BigInt.fromString(event.amount));
    }

    // burn entity
    const transaction = loadTransaction(tx);
    const burn = new Burn(transaction.id + "-" + tx.logOrdinal.toString());
    burn.transaction = transaction.id;
    burn.timestamp = transaction.timestamp;
    burn.pool = pool.id;
    burn.token0 = pool.token0;
    burn.token1 = pool.token1;
    burn.owner = Address.fromString(event.owner);
    burn.origin = Address.fromString(tx.from);
    burn.amount = BigInt.fromString(event.amount);
    burn.amount0 = amount0;
    burn.amount1 = amount1;
    burn.amountUSD = amountUSD;
    burn.tickLower = BigInt.fromI32(event.tickLower);
    burn.tickUpper = BigInt.fromI32(event.tickUpper);
    burn.logIndex = BigInt.fromI32(tx.logOrdinal as i32);

    // tick entities
    const lowerTickId =
      poolAddress + "#" + BigInt.fromI32(event.tickLower).toString();
    const upperTickId =
      poolAddress + "#" + BigInt.fromI32(event.tickUpper).toString();
    const lowerTick = Tick.load(lowerTickId);
    const upperTick = Tick.load(upperTickId);
    if (lowerTick && upperTick) {
      const amount = BigInt.fromString(event.amount);
      lowerTick.liquidityGross = lowerTick.liquidityGross.minus(amount);
      lowerTick.liquidityNet = lowerTick.liquidityNet.minus(amount);
      upperTick.liquidityGross = upperTick.liquidityGross.minus(amount);
      upperTick.liquidityNet = upperTick.liquidityNet.plus(amount);

      lowerTick.save();
      upperTick.save();
    }
    updateDex223DayData(tx);
    updatePoolDayData(tx);
    updatePoolHourData(tx);
    updateTokenDayData(token0 as Token, tx);
    updateTokenDayData(token1 as Token, tx);
    updateTokenHourData(token0 as Token, tx);
    updateTokenHourData(token1 as Token, tx);

    token0.save();
    token1.save();
    pool.save();
    factory.save();
    burn.save();
  }
}
